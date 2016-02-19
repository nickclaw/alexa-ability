import debug from 'debug';
import assert from 'assert';
import noop from 'lodash/noop';
import flattenDeep from 'lodash/flattenDeep';
import { Request } from './Request';
import { resolve } from './resolve';
import { verifyApplication } from './middleware/verifyApplication';
import { handleEvent } from './middleware/handleEvent';

const cLog = debug('alexa-ability:ability:constructor');
const uLog = debug('alexa-ability:ability:use');
const oLog = debug('alexa-ability:ability:on');
const hLog = debug('alexa-ability:ability:handle');

const warnAppId = () => console.warn( // eslint-disable-line no-console
    'No "applicationId" provided, request may come from unauthorized sources'
);

const warnSent = () => console.warn( // eslint-disable-line no-console
    'Request already sent. Don\'t call "next" function after sending response.'
);


export class Ability {

    constructor(options = {}) { // eslint-disable-line no-unused-vars
        this._stack = [];

        if (options.applicationId) {
            cLog('adding verifyApplication middleware');
            this.use(verifyApplication(options.applicationId));
        } else {
            warnAppId();
        }
    }

    use(...fns) {
        assert(fns.length, 'expected at least one middleware');
        fns.forEach(fn => {
            assert(typeof fn === 'function', 'Expected function, got %o', fn);
            uLog(`adding middleware function: ${fn.name || '<unnamed function>'}`);
        });

        this._stack.push(...fns);
        return this;
    }

    on(event, ..._handlers) {
        const handlers = flattenDeep(_handlers);

        assert(typeof event === 'string', 'Expected string for event type');
        assert(handlers.length, 'Expected at least one handler');
        handlers.forEach(handler => {
            assert(typeof handler === 'function', 'Expected handler function, got %o', handler);
        });

        const fns = handlers.map(fn => handleEvent(event, fn));
        oLog(`adding ${fns.length} handlers for ${event} event`);
        this._stack.push(...fns);
        return this;
    }

    handle(event, callback = noop) {
        const stack = [...this._stack];
        let index = 0;

        // build request object and attach listeners
        const req = new Request(event);
        req.on('finished', () => setImmediate(callback, null, req));
        req.on('failed', err => setImmediate(callback, err, req));

        // if we ever reach this function then everything has failed
        function done(err) {
            // halt execution early if response has been sent
            if (req.sent) {
                warnSent();
                return;
            }

            // just fail
            if (err) {
                req.fail(err);
                return;
            }

            req.fail(new Error('Unhandled event.'));
        }

        // this function gives up execution to the next handler
        function next(err) {
            // halt execution early if response has been sent
            if (req.sent) {
                warnSent();
                return;
            }

            // no more handlers? fail
            if (index >= stack.length) {
                done(err);
                return;
            }

            const fn = stack[index++];
            const fnName = fn.name || fn.displayName || 'anonymous';

            if (fn.length >= 3 && err) {
                hLog(`executing error handler: <${fnName}>`);
                resolve(fn, next, err, req);
            } else if (fn.length < 3 && !err) {
                // all's well! try the handler
                hLog(`executing handler: <${fnName}>`);
                resolve(fn, next, req);
            } else {
                // not correct type of handler
                hLog(`skipping handler: <${fnName}>`);
                next(err);
            }
        }

        // start execution
        next();
        return req;
    }
}
