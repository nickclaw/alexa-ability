import debug from 'debug';
import assert from 'assert';
import noop from 'lodash/noop';
import { Request } from './Request';
import { getEventName } from './getEventName';
import { handlers } from './defaultHandlers';
import * as e from './standardEvents';
import { resolve } from './resolve';

const uLog = debug('alexa-ability:ability:use');
const oLog = debug('alexa-ability:ability:on');
const hLog = debug('alexa-ability:ability:handle');

export class Ability {

    constructor(options = {}) { // eslint-disable-line no-unused-vars
        this._middleware = [];
        this._handlers = { ...handlers };
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

    handle(event, callback = noop) {
        const type = getEventName(event);
        const req = new Request(event);
        req.on('finished', () => callback(null, req));
        req.on('failed', err => callback(err, req));

        // get possible handlers
        const errHandler = this._handlers[e.error];
        const defHandler = this._handlers[e.unhandledEvent];
        const handler = this._handlers[type] || defHandler;

        // log
        if (this._handlers[type]) hLog(`handling event: ${type}`);
        else hLog(`no handler found for event: "${type}".`);

        let index = 0;
        const stack = [].concat(this._middleware, handler);

        next();

        return req;

        function next(err) {
            if (err) {
                hLog('executing error handler');
                resolve(errHandler, done, err, req);
                return;
            }

            const fn = stack[index++];
            if (!fn) {
                hLog('executing unhandledEvent handler');
                resolve(defHandler, done, req);
                return;
            }

            hLog(`executing function <${fn.name || 'anonymous'}>`);
            resolve(fn, next, req);
        }

        // if we ever reach this function then everything has failed
        function done(err) {
            if (err) {
                req.emit('failed', err);
            } else {
                req.emit('failed', new Error('Unhandled event.'));
            }
        }
    }
}
