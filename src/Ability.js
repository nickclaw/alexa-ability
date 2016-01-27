import Promise from 'bluebird';
import debug from 'debug';
import assert from 'assert';
import { Request } from './Request';
import { getEventName } from './getEventName';
import { resolve } from './resolve';
import { handlers } from './defaultHandlers';
import * as e from './standardEvents'


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

        // 1. run middleware
        // 2. run handler
        // 3. if error, try to catch
        // 4. if success, resolve req
        return Promise.resolve(this._middleware)
            .tap(fns => hLog(`executing ${fns.length} middleware.`))
            .each(fn => {
                hLog(`executing middleware function: ${fn.name || '<unnamed function>'}`);
                return resolve(fn, req)
            })
            .tap(() => hLog(`executing handler for event: ${type}`))
            .then(() => resolve(handler, req))
            .catch(err => resolve(errHandler, err, req))
            .return(req);
    }
}
