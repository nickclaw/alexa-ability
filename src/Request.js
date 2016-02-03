import get from 'lodash/get';
import transform from 'lodash/transform';
import { renderToString } from 'alexa-ssml';
import { EventEmitter } from 'events';

export class Request extends EventEmitter {

    constructor(event) {
        super();

        this.raw = event;
        this.sent = false;
        this.isNew = get(event, 'session.new', false);
        this.version = get(event, 'version', '1.0');
        this.session = get(event, 'session.attributes', {});
        this.user = get(event, 'session.user', {});
        this.slots = this.params = transform(
            get(event, 'request.intent.slots'),
            (obj, slot) => obj[slot.name] = slot.value,
            {}
        );

        this._res = {
            outputSpeech: null,
            card: null,
            reprompt: null,
            shouldEndSession: false,
        };
    }

    say(content) {
        this._res.outputSpeech = toSpeechResponse(content);
        return this;
    }

    show(title, content) {
        this._res.card = {
            title,
            content,
            type: 'Simple',
        };
        return this;
    }

    reprompt(content) {
        this._res.reprompt = {
            outputSpeech: toSpeechResponse(content),
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

    toJSON() {
        const { version, session, _res: response } = this;

        return {
            version,
            response,
            sessionAttributes: session,
        };
    }
}

function toSpeechResponse(content) {
    const isTag = get(content, 'tag');

    return isTag ?
        { type: 'SSML', ssml: renderToString(content) } :
        { type: 'PlainText', text: content };
}
