import get from 'lodash/get';
import omit from 'lodash/omit';
import { renderToString } from 'alexa-ssml';
import { EventEmitter } from 'events';

export class Request extends EventEmitter {

    constructor(event) {
        super();

        this.raw = event;
        this.isNew = get(event, 'session.new', false);
        this.version = get(event, 'version', '1.0');
        this.session = get(event, 'session.session', {});
        this.params = get(event, 'request.intent.slots', {});

        this._res = {
            outputSpeech: null,
            card: null,
            reprompt: null,
            shouldEndSession: false
        };
    }

    say(content) {
        this._res.outputSpeech = toSpeechResponse(content);
        return this;
    }

    show(title, content) {
        this._res.card = {
            type: "Simple",
            title: title,
            content: content
        };
        return this;
    }

    reprompt(content) {
        this._res.reprompt = {
            outputSpeech: toSpeechResponse(content)
        };
        return this;
    }

    end() {
        this._res.shouldEndSession = true;
        return this.send();
    }

    send() {
        this.emit('finished', this);
        // fine to return undefined
    }

    toJSON() {
        const { version, session, _res: response } = this;

        return {
            version: version,
            response: response,
            sessionAttributes: { session }
        };
    }
}

function toSpeechResponse(content) {
    const isTag = get(content, 'tag');

    return isTag ?
        { type: "SSML", ssml: renderToString(content) } :
        { type: "PlainText", text: content } ;
}
