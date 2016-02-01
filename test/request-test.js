/** @jsx ssml */

import { ssml } from 'alexa-ssml';
import { EventEmitter } from 'events';
import { Request } from '../src/Request';

const intentRequest = require('./fixtures/intent-request');
const intentResponse = require('./fixtures/intent-response');


describe('Request', function() {

    let req = null;

    beforeEach(function() {
        req = new Request(intentRequest);
    });

    describe('object', function() {

        it('should be an EventEmitter', function() {
            expect(req).to.be.instanceOf(EventEmitter);
        });

        it('should have a "sent" field', function() {
            expect(req.sent).to.equal(false);
        });

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
            expect(req.params).to.deep.equal({
                ZodiacSign: 'virgo'
            });
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
                ssml: "<speak/>"
            });
        });
    });

    describe('"show" function', function() {

        it('should chain', function() {
            expect(req.show("foo")).to.equal(req);
        });

        it('should set the title and content of the card', function() {
            req.show('foo', 'bar');
            expect(req.toJSON().response.card).to.deep.equal({
                type: "Simple",
                title: 'foo',
                content: 'bar'
            });
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
                ssml: "<speak/>"
            });
        });
    });

    describe('"end" function', function() {
        it('should not chain', function() {
            expect(req.end("foo")).to.be.undefined;
        });

        it('should end the session', function() {
            req.end();
            expect(req.toJSON().response.shouldEndSession).to.equal(true);
        });

        it('should emit the "finished" event', function() {
            const spy = sinon.spy();
            req.on('finished', spy);
            expect(spy).to.not.have.been.called;
            req.end();
            expect(spy).to.have.been.called;
        });

        it('should set the sent property to true', function() {
            expect(req.sent).to.equal(false);
            req.end();
            expect(req.sent).to.equal(true);
        });
    });

    describe('"send" function', function() {
        it('should not chain', function() {
            expect(req.end("foo")).to.be.undefined;
        });

        it('should emit the "finished" event', function() {
            const spy = sinon.spy();
            req.on('finished', spy);
            expect(spy).to.not.have.been.called;
            req.end();
            expect(spy).to.have.been.called;
        });

        it('should set the sent property to true', function() {
            expect(req.sent).to.equal(false);
            req.end();
            expect(req.sent).to.equal(true);
        });
    });

    describe('"toJSON" function', function() {

        it('should work', function() {
            req.say("foo").show("foo", "bar").reprompt(<speak>foo</speak>).end();
            expect(req.toJSON()).to.deep.equal(intentResponse);
        });
    });
});
