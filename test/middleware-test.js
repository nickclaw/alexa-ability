import { Ability } from '../src/Ability';
import { Request } from '../src/Request';

const launchRequest = require('./fixtures/launch-request');

describe('Ability middleware', function() {

    let app = null;

    beforeEach(function() {
        app = new Ability();
    });

    it('should be possible to add middleware to an ability', function() {
        app.use(function(){ });
        expect(app._middleware.length).to.equal(1);
    });

    it('should be called with the request object', function() {
        const spy = sinon.spy();
        app.use(spy);

        return app.handle(launchRequest)
            .then(req => {
                expect(spy).to.have.been.called;
                const arg = spy.args[0][0];
                expect(arg).to.be.instanceOf(Request);
                expect(arg).to.equal(req);
            });
    });

    it('should call all middleware in order before handling a request', function() {
        const spyA = sinon.spy(function(req) {
            expect(spyB).to.not.have.been.called;
            expect(handler).to.not.have.been.called;
        });
        const spyB = sinon.spy(function(req) {
            expect(spyA).to.have.been.called;
            expect(handler).to.not.have.been.called;
        });
        const handler = sinon.spy(function(req) {
            expect(spyA).to.have.been.called;
            expect(spyB).to.have.been.called;
        });

        app.use(spyA);
        app.use(spyB);
        app.on('launch', handler);
        return app.handle(launchRequest);
    });

    it('should halt execution on a failed middleware function', function() {
        const err = new Error();
        const handler = sinon.spy();

        app.use(function() { throw err; });
        app.on('launch', handler);
        return app.handle(launchRequest).should.be.rejected
            .then(err => {
                expect(err).to.equal(err);
                expect(handler).to.not.have.been.called;
            });
    });
});
