import debug from 'debug';
import assert from 'assert';
import noop from 'lodash/noop';
import flattenDeep from 'lodash/flattenDeep';
import { Request } from './Request';
import { defaultHandlers } from './defaultHandlers';
import * as e from './standardEvents';
import { resolve } from './resolve';
import { verifyApplication } from './verifyApplication';
import { getEventName } from './getEventName';

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
        this._middleware = [];
        this._onError = null;
        this._handlers = { };

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

        this._middleware.push(...fns);
        return this;
    }

    on(event, ..._handlers) {
        const handlers = flattenDeep(_handlers);
        const currentHandlers = this._handlers[event] || [];

        assert(typeof event === 'string', 'Expected string for event type');
        assert(handlers.length, 'Expected at least one handler');
        handlers.forEach(handler => {
            assert(typeof handler === 'function', 'Expected handler function, got %o', handler);
        });

        oLog(`adding ${handlers.length} handlers to ${event} event`);
        this._handlers[event] = [...currentHandlers, ...handlers];
        oLog(`current ${this._handlers[event].length} handlers for ${event} event`);
        return this;
    }

    onError(handler) {
        this._onError = handler;
        return this;
    }

    handle(event, callback = noop) {
        // get possible handlers
        // it's fine if `handler` is null or undefined
        // it'll all be caught by the `unhandledEvent` handler
        const middleware = this._middleware;
        const errHandler = this._onError || defaultHandlers.errorHandler;
        const defHandler = this._handlers[e.unhandledEvent] || defaultHandlers.defaultHandler;
        const eventName = getEventName(event);
        const handler = eventName ? this._handlers[eventName] : null;

        // log
        if (handler) hLog(`handling event: ${eventName}`);
        else hLog(`no handler found for event: "${eventName}".`);

        // build request object and attach listeners
        const req = new Request(event);
        req.on('finished', () => callback(null, req));
        req.on('failed', err => callback(err, req));

        // iterate over the stack of middleware and handlers
        // kind of like express does
        let index = 0;
        const stack = [].concat(middleware, handler, defHandler);

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

            // uhoh, try error handler once
            if (err) {
                hLog('executing error handler');
                resolve(errHandler, done, err, req, done);
                return;
            }

            // no more handlers? fail
            if (index >= stack.length) {
                done();
                return;
            }

            const fn = stack[index++];

            // invalid handler? just skip it..
            if (typeof fn !== 'function') {
                hLog('invalid handler %s', fn);
                next();
                return;
            }

            // all's well! try the handler
            hLog(`executing function <${fn.name || 'anonymous'}>`);
            resolve(fn, next, req);
        }

        // start execution
        next();
        return req;
    }
}
