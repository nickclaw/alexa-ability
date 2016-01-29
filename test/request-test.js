/** @jsx ssml */

import { ssml } from 'alexa-ssml';
import { Request } from '../src/Request';

const intentRequest = require('./fixtures/intent-request');
const intentResponse = require('./fixtures/intent-response');


describe('Request', function() {

    let req = null;

    beforeEach(function() {
        req = new Request(intentRequest);
    });

    describe('object', function() {

        it('should have a "isNew" field', function() {
            expect(req.isNew).to.equal(intentRequest.session.new);
        });

        it('should have a "version" field', function() {
            expect(req.version).to.equal(intentRequest.version);
        });

        it('should have a "session" field', function() {
            expect(req.session).to.deep.equal({});
        });

        it('should have a "params" field', function() {
            expect(req.params).to.deep.equal(intentRequest.request.intent.slots);
        });
    });

    describe('"say" function', function() {

        it('should chain', function() {
            expect(req.say("foo")).to.equal(req);
        });

        it('should accept text', function() {
            req.say("foo");
            expect(req.toJSON().response.outputSpeech).to.deep.equal({
                type: "PlainText",
                text: "foo"
            });
        });

        it('should accept ssml', function() {
            req.say(<speak />);
            expect(req.toJSON().response.outputSpeech).to.deep.equal({
                type: "SSML",
                ssml: "<speak></speak>\n"
            });
        });
    });

    describe.skip('"show" function', function() {

        it('should chain', function() {
            expect(req.show("foo")).to.equal(req);
        });

        it('should set the title and content of the card', function() {

        });
    });

    describe('"reprompt" function', function() {

        it('should chain', function() {
            expect(req.reprompt("foo")).to.equal(req);
        });

        it('should accept text', function() {
            req.reprompt("foo");
            expect(req.toJSON().response.reprompt.outputSpeech).to.deep.equal({
                type: "PlainText",
                text: "foo"
            });
        });

        it('should accept ssml', function() {
            req.reprompt(<speak />);
            expect(req.toJSON().response.reprompt.outputSpeech).to.deep.equal({
                type: "SSML",
                ssml: "<speak></speak>\n"
            });
        });
    });

    describe('"end" function', function() {
        it('should chain', function() {
            expect(req.end("foo")).to.equal(req);
        });

        it('should ', function() {
            req.end();
            expect(req.toJSON().response.shouldEndSession).to.equal(true);
        })
    });

    describe('"toJSON" function', function() {

        it('should work', function() {
            req.say("foo").show("foo").reprompt(<speak>foo</speak>).end();
            expect(req.toJSON()).to.deep.equal(intentResponse);
        });
    });
});
