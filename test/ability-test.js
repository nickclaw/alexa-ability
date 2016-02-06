import noop from 'lodash/noop';
import { Ability } from '../src/Ability';
import { Request } from '../src/Request';
import * as e from '../src/standardEvents';

const launchRequest = require('./fixtures/launch-request');
const unknownRequest = require('./fixtures/unknown-request');

describe('Ability', function() {

    let app = null;

    beforeEach(function() {
        app = new Ability({
            applicationId: launchRequest.session.application.applicationId
        });
    });

    describe('"constructor"', function() {
        it('should return an instanceof Ability', function() {
            const ability = new Ability({ applicationId: "foo" });
            expect(ability).to.be.instanceOf(Ability);
        });

        it('should warn if no applicationId is provided', function() {
            const _oldWarn = console.warn;
            console.warn = sinon.spy(_oldWarn);
            const ability = new Ability();
            expect(console.warn).to.have.been.called;
            console.warn = _oldWarn;
        });
    });

    describe('"use" function', function() {
        it('should throw if not passed a function', function() {
            expect(() => app.use(null)).to.throw;
        });

        it('should return the ability instance', function() {
            expect(app.use(noop)).to.equal(app);
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
    });

    describe('"handle" function', function() {
        it('should return a request', function() {
            app.on(e.launch, function(req){ req.send() });
            const result = app.handle(launchRequest);
            expect(result).to.be.instanceOf(Request);
        });

        it('should call the callback with the request when successful', function(done) {
            app.on(e.launch, function(req){ req.send() });
            app.handle(launchRequest, function(err, req) {
                if (err) return done(err);
                expect(req).to.be.instanceOf(Request)
                done();
            });
        });

        it('should call the callback with the error when middleware fails', function(done) {
            const err = new Error();
            app.use(function(){ throw err });
            app.on(e.launch, function(req, done){ req.send() });
            app.handle(launchRequest, function(err, req) {
                expect(err).to.be.equal(err);
                expect(req).to.be.instanceOf(Request);
                done();
            });
        });

        it('should attempt the error handler when middleware fails', function(done) {
            const err = new Error();
            const spy = sinon.spy((err, req) => req.end());

            app.use(function(){ throw err });
            app.on(e.launch, function(req, done){ req.send() });
            app.on(e.error, spy);

            app.handle(launchRequest, function(err, req) {
                if (err) return done(err);
                expect(spy).to.have.been.called
                done();
            });
        });

        it('should attempt the error handler when the handler fails', function(done) {
            const err = new Error();
            const spy = sinon.spy((err, req) => req.end());

            app.on(e.launch, function(){ throw err });
            app.on(e.error, spy);

            app.handle(launchRequest, function(err, req) {
                if (err) return done(err);
                expect(spy).to.have.been.called
                done();
            });
        });

        it('should use the "unknownEvent" handler for unknown events', function(done) {
            const spy = sinon.spy((req) => req.end());

            app.on(e.unknownEvent, spy);

            app.handle(unknownRequest, function(err, req) {
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
            app.on('launch', spy);
            app.handle(launchRequest, function(err, req) {
                expect(err).to.be.falsy;
                expect(spy).to.not.have.been.called;
                done();
            });
        });

        it('should should warn when "next" is called after request has been sent', function(done) {
            const _oldWarn = console.warn;
            console.warn = sinon.spy(_oldWarn);

            app.use((req, next) => {
                req.end();
                next();
            });
            app.on('launch', req => req.end());
            app.handle(launchRequest, function(err, req) {
                process.nextTick(function() { // give it time for warning to happen
                    expect(err).to.be.falsy;
                    expect(console.warn).to.have.been.called;
                    console.warn = _oldWarn;
                    done();
                });
            });
        });
    });
});
