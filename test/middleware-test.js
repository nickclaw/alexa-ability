import { Ability } from '../src/Ability';
import { Request } from '../src/Request';

const intentRequest = require('./fixtures/intent-request');

describe('Ability middleware', function() {

    let app = null;

    beforeEach(function() {
        app = new Ability({
            applicationId: intentRequest.session.application.applicationId
        });
    });

    it('should be possible to add middleware to an ability', function() {
        app.use(function(){ });
        expect(app._middleware.length).to.equal(2); // one is the verifyApplication middleware
    });

    it('should be called with the request object', function(done) {
        const spy = sinon.spy((req, done) => done());
        app.use(spy);
        app.on("GetZodiacHoroscopeIntent", req => req.end());

        app.handle(intentRequest, function(err, req) {
            if (err) return done(err);
            expect(spy).to.have.been.called;
            const arg = spy.args[0][0];
            expect(arg).to.be.instanceOf(Request);
            expect(arg).to.equal(req);
            done();
        });
    });

    it('should call all middleware in order before handling a request', function(done) {
        const spyA = sinon.spy(function(req, done) {
            expect(spyB).to.not.have.been.called;
            expect(handler).to.not.have.been.called;
            done();
        });
        const spyB = sinon.spy(function(req, done) {
            expect(spyA).to.have.been.called;
            expect(handler).to.not.have.been.called;
            done();
        });
        const handler = sinon.spy(function(req) {
            expect(spyA).to.have.been.called;
            expect(spyB).to.have.been.called;
            req.end();
        });

        app.use(spyA);
        app.use(spyB);
        app.on("GetZodiacHoroscopeIntent", handler);
        app.handle(intentRequest, done);
    });

    it('should halt execution on a failed middleware function', function(done) {
        const err = new Error();
        const handler = sinon.spy();

        app.use(function() { throw err; });
        app.on("GetZodiacHoroscopeIntent", handler);
        app.handle(intentRequest, function(err, req) {
            expect(err).to.equal(err);
            expect(handler).to.not.have.been.called;
            done();
        });
    });

    it('should execute middleware even when no handler exists(?)', function(done) {
        const spy = sinon.spy((req, done) => done());
        app.use(spy);
        app.on('unhandledEvent', req => req.end());
        app.handle(intentRequest, function(err, req) {
            if (err) return done(err);
            expect(spy).to.have.been.called;
            done();
        });
    });

    it('should stop execution if middleware responds', function(done) {
        const spy = sinon.spy(req => req.end());

        app.use(req => req.end());
        app.on("GetZodiacHoroscopeIntent", spy);
        app.handle(intentRequest, function(err, req) {
            if (err) return done(err);
            expect(spy).to.not.have.been.called
            done();
        });
    });

    it('using "req.fail()" should immediately halt execution and fail', function() {
        const spy = sinon.spy(req => req.end());
        const err = new Error();

        app.use(req => req.fail(err));
        app.on("GetZodiacHoroscopeIntent", spy);
        app.handle(intentRequest, function(e, req) {
            expect(spy).to.not.have.been.called;
            expect(e).to.equal(err);
            expect(req.sent).to.equal(true);
        });
    });
});
