import debug from 'debug';
import assert from 'assert';
import noop from 'lodash/noop';
import get from 'lodash/get';
import { Request } from './Request';
import { defaultHandlers } from './defaultHandlers';
import * as e from './standardEvents';
import { resolve } from './resolve';
import { verifyApplication } from './verifyApplication';

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
        this._onLaunch = null;
        this._onError = defaultHandlers.errorHandler;
        this._onEnd = null;
        this._handlers = {
            [e.unhandledEvent]: defaultHandlers.defaultHandler,
        };


        if (options.applicationId) {
            cLog('adding verifyApplication middleware');
            this.use(verifyApplication(options.applicationId));
        } else {
            warnAppId();
        }
    }

    use(fn) {
        assert(typeof fn === 'function', 'Expected function');
        uLog(`adding middleware function: ${fn.name || '<unnamed function>'}`);

        this._middleware.push(fn);
        return this;
    }

    on(event, handler) {
        assert(typeof event === 'string', 'Expected string for event type');
        assert(typeof handler === 'function', 'Expected function for event handler');
        if (this._handlers[event]) oLog(`overwrote handler for event: ${event}`);
        else oLog(`added handler for event: ${event}`);

        this._handlers[event] = handler;
        return this;
    }

    onLaunch(handler) {
        this._onLaunch = handler;
        return this;
    }

    onError(handler) {
        this._onError = handler;
        return this;
    }

    onEnd(handler) {
        this._onEnd = handler;
        return this;
    }

    handle(event, callback = noop) {
        // get possible handlers
        // it's fine if `handler` is null or undefined
        // it'll all be caught by the `unhandledEvent` handler
        const type = get(event, 'request.type');
        const reason = get(event, 'request.reason');
        const errHandler = this._onError;
        const defHandler = this._handlers[e.unhandledEvent];
        let handler = null;
        switch (type) {
            case 'LaunchRequest':
                handler = this._onLaunch;
                break;
            case 'SessionEndedRequest':
                // TODO don't wrap this handler
                handler = (a, b) => this._onEnd(reason, a, b);
                break;
            default:
                const intent = get(event, 'request.intent.name');
                handler = this._handlers[intent];
        }

        // log
        if (handler) hLog(`handling event: ${type}`);
        else hLog(`no handler found for event: "${type}".`);

        // build request object and attach listeners
        const req = new Request(event);
        req.on('finished', () => callback(null, req));
        req.on('failed', err => callback(err, req));

        // iterate over the stack of middleware and handlers
        // kind of like express does
        let index = 0;
        const stack = [].concat(this._middleware, handler);

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

            const fn = stack[index++];

            // no handler? try default handler once
            if (!fn) {
                hLog('executing unhandledEvent handler');
                // TODO should this be catchable by the error handler?
                resolve(defHandler, done, req);
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
