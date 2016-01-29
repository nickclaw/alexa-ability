import get from 'lodash/get';
import omit from 'lodash/omit';
import { renderToString } from 'alexa-ssml';

export class Request {

    constructor(event) {
        this._event = event;

        this.isNew = get(event, 'session.new', false);
        this.version = get(event, 'version', '1.0');
        this.session = get(event, 'session.session', {});
        this.params = get(event, 'request.intent.slots', {});

        this._speech = null;
        this._card = null;
        this._reprompt = null;
        this._end = false;
    }

    say(content) {
        this._speech = content;
        return this;
    }

    show(content) {
        this._card = content;
        return this;
    }

    reprompt(content) {
        this._reprompt = content;
        return this;
    }

    end() {
        this._end = true;
        return this;
    }

    toJSON() {
        const data = {
            version: this.version,
            sessionAttributes: this.session,
            response: { shouldEndSession: this._end }
        };

        if (this._speech)
            data.response.outputSpeech = toSpeechResponse(this._speech);

        if (this._card)
            data.response.card = {
                type: "Simple",
                title: "Response",
                content: this._card
            };

        if (this._reprompt)
            data.response.reprompt = {
                outputSpeech: toSpeechResponse(this._reprompt)
            };

        return data;
    }
}

function toSpeechResponse(content) {
    const isTag = get(content, 'tag');

    return isTag ?
        { type: "SSML", text: renderToString(content) } :
        { type: "PlainText", text: content } ;
}
