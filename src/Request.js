import get from 'lodash/get';
import transform from 'lodash/transform';
import { EventEmitter } from 'events';
import { toSpeechResponse } from './toSpeechResponse';
import { getEventName } from './getEventName';
import debug from 'debug';

const log = debug('alexa-ability:ability:request');

export class Request extends EventEmitter {

    constructor(event) {
        super();

        // metadata
        this.raw = event;
        this.handler = getEventName(event);
        this.sent = false;
        this.isNew = get(event, 'session.new', false);
        this.isEnding = !!get(event, 'request.reason');
        this.reason = get(event, 'request.reason', null);

        // request data
        this.version = get(event, 'version', '1.0');
        this.user = get(event, 'session.user', {});
        this.session = get(event, 'session.attributes', {});
        this.slots = this.params = transform(
            get(event, 'request.intent.slots'),
            (obj, slot) => { obj[slot.name] = slot.value; },
            {}
        );

        this._res = {
            outputSpeech: null,
            card: null,
            reprompt: null,
            shouldEndSession: false,
        };
    }

    say(type, value) {
        this._res.outputSpeech = toSpeechResponse(type, value);
        return this;
    }

    show(card, text) {
        if (typeof card === 'string') {
            log('showing Simple card');
            this._res.card = {
                type: 'Simple',
                title: card,
                content: text,
            };
        } else {
            log('showing Standard card type');
            // TODO validation?
            this._res.card = {
                type: 'Standard',
                ...card,
            };
        }
        return this;
    }

    linkAccount() {
        this._res.card = {
            type: 'LinkAccount',
        };
        return this;
    }

    reprompt(type, value) {
        this._res.reprompt = {
            outputSpeech: toSpeechResponse(type, value),
        };
        return this;
    }

    end() {
        this._res.shouldEndSession = true;
        return this.send();
    }

    send() {
        this.sent = true;
        this.emit('finished', this);
        // fine to return undefined
    }

    fail(err) {
        this.sent = true;
        this.emit('failed', err, this);
    }

    toJSON() {
        const { version, session, _res: response } = this;

        return {
            version,
            response,
            sessionAttributes: session,
        };
    }
}

// Setup some simple aliases
// Eventually I'd like to use a decorator for this but the spec isn't totally ready
Request.prototype.ask = Request.prototype.send;
Request.prototype.tell = Request.prototype.end;
