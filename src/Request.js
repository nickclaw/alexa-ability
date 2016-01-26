import get from 'lodash/get';
import omit from 'lodash/omit';

export class Request {

    constructor(event) {
        this._event = event;

        this.version = get(event, 'version', '1.0');
        this.session = get(event, 'session', {});
        this.params = get(event, 'request.intent.slots', {});
    }

    say(text) {
        this._speech = text;
        return this;
    }

    show(text) {
        this._card = text;
        return this;
    }

    reprompt(text) {
        this._reprompt = text;
        return this;
    }

    end() {
        this._end = true;
    }

    toJSON() {
        const data = {
            version: this.version,
            sessionAttributes: omit(this.session, []),
            response: { shouldEndSession: this._end }
        };

        if (this._speech) data.response.outputSpeech = {
            type: "PlainText",
            text: this._speech
        };

        if (this._card) data.response.card = {
            type: "Simple",
            title: "Response",
            content: this._card
        };

        if (this._reprompt) data.response.reprompt = {
            outputSpeech: {
                type: "PlainText",
                text: this._reprompt
            }
        };

        return data;
    }
}
