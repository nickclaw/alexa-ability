import noop from 'lodash/noop';
import { Ability } from '../src/Ability';
import { Request } from '../src/Request';
import * as e from '../src/standardEvents';

const intentRequest = require('./fixtures/intent-request');

describe('Ability', function() {

    let app = null;

    beforeEach(function() {
        app = new Ability({
            applicationId: intentRequest.session.application.applicationId
        });
    });

    describe('"constructor"', function() {
        it('should return an instanceof Ability', function() {
            const ability = new Ability({ applicationId: "foo" });
            expect(ability).to.be.instanceOf(Ability);
        });

        it('should warn if no applicationId is provided', function() {
            const _oldWarn = console.warn;
            console.warn = sinon.spy(() => null);
            const ability = new Ability();
            expect(console.warn).to.have.been.called;
            console.warn = _oldWarn;
        });

        it('should add verifyApplication middleare if application is provided', function() {
            const ability = new Ability({ applicationId: 'foo' });
            expect(ability._stack.length).to.equal(1);
        });
    });

    describe('"use" function', function() {
        it('should throw if not passed a function', function() {
            expect(() => app.use(null)).to.throw;
        });

        it('should return the ability instance', function() {
            expect(app.use(noop)).to.equal(app);
        });

        it('should accept multiple middleware', function() {
            app.use(noop, noop, noop);
            expect(app._stack.length).to.equal(4); // +1 for verifyApp middleware
        });
    });

    describe('error handling', function() {
        it('should handle errors', function(done) {
            const spy = sinon.spy((err, req, next) => res.send());
            const err = new Error();
            app.use((req, next) => next(err));
            app.use(spy);

            app.handle(intentRequest, function() {
                expect(spy).to.be.called;
                expect(spy.args[0][0]).to.equal(err);
                expect(spy.args[0][1]).to.be.instanceOf(Request);
                expect(spy.args[0][2]).to.be.instanceOf(Function);
                done();
            });
        });
    });

    describe('"on" function', function() {
        it('should throw if not passed an event name', function() {
            expect(() => app.use(null, noop)).to.throw;
        });

        it('should throw if not passed a function handler', function() {
            expect(() => app.use('event', null)).to.throw;
        });

        it('should return the ability instance', function() {
            expect(app.use(noop)).to.equal(app);
        });

        it('should accept multiple handlers', function(done) {
            const spyA = sinon.spy((req, next) => next());
            const spyB = sinon.spy((req, next) => next());
            const spyC = sinon.spy((req, next) => req.end());
            app.on('GetZodiacHoroscopeIntent', spyA, spyB, spyC);
            expect(app._stack.length).to.equal(4); // +1 for verifyApp
            app.handle(intentRequest, function(err) {
                if (err) return done(err);
                expect(spyA).to.be.called;
                expect(spyB).to.be.called;
                expect(spyC).to.be.called;
                done();
            });
        });
    });

    describe('"handle" function', function() {
        it('should return a request', function() {
            app.on("GetZodiacHoroscopeIntent", function(req){ req.send() });
            const result = app.handle(intentRequest);
            expect(result).to.be.instanceOf(Request);
        });

        it('should set the "handler" property on the request', function() {
            app.on("GetZodiacHoroscopeIntent", function(req){ req.send() });
            const result = app.handle(intentRequest);
            expect(result.handler).to.equal("GetZodiacHoroscopeIntent");
        });

        it('should call the callback with the request when successful', function(done) {
            app.on("GetZodiacHoroscopeIntent", function(req){ req.send() });
            app.handle(intentRequest, function(err, req) {
                if (err) return done(err);
                expect(req).to.be.instanceOf(Request)
                done();
            });
        });

        it('should call the callback with the error when middleware fails', function(done) {
            const err = new Error();
            app.use(function(){ throw err });
            app.on("GetZodiacHoroscopeIntent", function(req, done){ req.send() });
            app.handle(intentRequest, function(err, req) {
                expect(err).to.be.equal(err);
                expect(req).to.be.instanceOf(Request);
                done();
            });
        });

        it('should attempt the error handler when middleware fails', function(done) {
            const err = new Error();
            const spy = sinon.spy((err, req, next) => req.end());

            app.use(function(){ throw err });
            app.on("GetZodiacHoroscopeIntent", function(req, done){ req.send() });
            app.use(spy);

            app.handle(intentRequest, function(err, req) {
                if (err) return done(err);
                expect(spy).to.have.been.called
                done();
            });
        });

        it('should attempt the error handler when the handler fails', function(done) {
            const err = new Error();
            const spy = sinon.spy((err, req, next) => req.end());

            app.on("GetZodiacHoroscopeIntent", function(){ throw err });
            app.use(spy);

            app.handle(intentRequest, function(err, req) {
                if (err) return done(err);
                expect(spy).to.have.been.called
                done();
            });
        });

        it('should not call more middleware or handlers after request has been sent', function(done) {
            const spy = sinon.spy((req, next) => req.end());
            app.use((req, next) => {
                req.end();
                next();
            });
            app.on("GetZodiacHoroscopeIntent", spy);
            app.handle(intentRequest, function(err, req) {
                expect(err).to.be.falsy;
                expect(spy).to.not.have.been.called;
                done();
            });
        });

        it('should should warn when "next" is called after request has been sent', function(done) {
            const _oldWarn = console.warn;
            console.warn = sinon.spy(() => null);

            app.use((req, next) => {
                req.end();
                next();
            });
            app.on("GetZodiacHoroscopeIntent", req => req.end());
            app.handle(intentRequest, function(err, req) {
                process.nextTick(function() { // give it time for warning to happen
                    expect(err).to.be.falsy;
                    expect(console.warn).to.have.been.called;
                    console.warn = _oldWarn;
                    done();
                });
            });
        });

        it('should be asynchronous even when request is ended synchronously', function(done) {
            const finishedSpy = sinon.spy();
            const handledSpy = sinon.spy();

            app.use(req => {
                req.on('finished', finishedSpy);
                req.end();
            });

            app.handle(intentRequest, handledSpy);
            expect(finishedSpy).to.be.called;
            expect(handledSpy).to.not.be.called;

            setTimeout(function() {
                expect(handledSpy).to.be.called;
                done();
            })
        });
    });
});
