import co from 'co';
import debug from 'debug';
import { Request } from './Request';
import { getEventName } from './getEventName';
import { resolve } from './resolve';

const uLog = debug('alexa-ability:ability:use');
const oLog = debug('alexa-ability:ability:on');
const hLog = debug('alexa-ability:ability:handle');

export class Ability {

    constructor(options = {}) {
        this._middleware = [];
        this._handlers = {};
    }

    use(fn) {
        uLog(`adding middleware function: ${fn.name || '<unnamed function>'}`);
        this._middleware.push(fn);
        return this;
    }

    on(event, fn) {
        if (this._handlers[event]) oLog(`averwrote handler for event: ${event}`);
        else oLog(`added handler for event: ${event}`);

        this._handlers[event] = fn;
        return this;
    }

    handle = co.wrap(function *handle(event) {
        const req = new Request(event);
        const type = getEventName(event);
        const handler = this._handlers[type];


        if (!handler) hLog(`ao handler found for event: "${type}".`);
        else hLog(`handling event: ${type}`);

        hLog(`executing ${this._middleware.length} middleware.`);
        for (let fn of this._middleware) {
            hLog(`executing middleware function: ${fn.name || '<unnamed function>'}`);
            yield resolve(fn, req);
        }

        if (handler) {
            hLog(`executing handler for event: ${type}`);
            yield resolve(handler, req);
        }

        return req;
    });
}
