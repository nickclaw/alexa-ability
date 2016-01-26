import co from 'co';
import { Request } from './Request';
import { getEventName } from './getEventName';
import { resolve } from './resolve';

export class Ability {

    constructor(options = {}) {
        this._middleware = [];
        this._handlers = {};
    }

    use(fn) {
        this._middleware.push(fn);
        return this;
    }

    on(intent, fn) {
        this._handlers[intent] = fn;
        return this;
    }

    handle = co.wrap(function *handle(event) {
        const req = new Request(event);
        const type = getEventName(event);
        const handler = this._handlers[type];

        console.log(`Running ${this._middleware.length} middleware.`);
        for (let fn of this._middleware) {
            yield resolve(fn, req);
        }

        console.log(`Running ${type} handler.`);
        if (handler) {
            yield resolve(handler, req);
        }

        return req;
    });
}
