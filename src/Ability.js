import Promise from 'bluebird';
import debug from 'debug';
import assert from 'assert';
import { Request } from './Request';
import { getEventName } from './getEventName';
import { handlers } from './defaultHandlers';
import * as e from './standardEvents';
import { resolve } from './resolve';

const uLog = debug('alexa-ability:ability:use');
const oLog = debug('alexa-ability:ability:on');
const hLog = debug('alexa-ability:ability:handle');

export class Ability {

    constructor(options = {}) {
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

    handle(event) {
        const type = getEventName(event);
        const req = new Request(event);

        // get possible handlers
        const errHandler = this._handlers[e.error];
        const defHandler = this._handlers[e.unhandledEvent];
        const handler = this._handlers[type] || defHandler;

        // log
        if (this._handlers[type]) hLog(`handling event: ${type}`);
        else hLog(`no handler found for event: "${type}".`);

        let index = 0;
        const stack = [].concat(this._middleware, handler);

        return Promise.fromNode(function(done) {
            req.on('finished', req => done(null, req));
            next();

            function next(err) {
                if (err) {
                    hLog('executing error handler');
                    resolve(errHandler, done, err, req);
                    return;
                }

                const fn = stack[index++];
                if (!fn) {
                    hLog('executing default handler');
                    resolve(defHandler, next, req);
                    return;
                }

                hLog(`executing function <${fn.name || 'anonymous'}>`);
                resolve(fn, next, req);
            }
        }).return(req);
    }
}
