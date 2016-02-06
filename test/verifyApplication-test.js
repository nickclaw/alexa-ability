import { verifyApplication } from '../src/verifyApplication';
import intentRequest from './fixtures/intent-request';

const appId = intentRequest.session.application.applicationId;
const middleware = verifyApplication(appId);

describe('verifyApplication', function() {

    it('is a function that returns a middleware function', function() {
        expect(verifyApplication).to.be.instanceOf(Function);
        const fn = verifyApplication('foo');
        expect(fn).to.be.instanceOf(Function);
        expect(fn.length).to.equal(2);
    });

    describe('middleware function', function() {

        it('should call "req.fail()" if the applicationId is invalid', function() {
            const req = {
                raw: { session: { application: { applicationId: 'foo' } } },
                fail: sinon.spy()
            };
            const next = sinon.spy();

            middleware(req, next);
            expect(next).to.not.be.called;
            expect(req.fail).to.be.called;
            expect(req.fail.args[0][0]).to.be.instanceOf(Error);
        });

        it('should call the "next" function if applicationId is valid', function() {
            const req = {
                raw: { session: { application: { applicationId: appId } } },
                fail: sinon.spy()
            };
            const next = sinon.spy();

            middleware(req, next);
            expect(next).to.be.called;
            expect(next.args[0]).to.be.empty;
            expect(req.fail).to.not.be.called;
        });
    });
});
