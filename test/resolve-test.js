import { resolve } from '../src/resolve';

const req = {};
const err = new Error();

describe('resolve(fn, ...args, done)', function() {

    it('should handle functions that throw synchronously', function(done) {
        const handler = sinon.spy((req, next) => { throw err });
        const callback = (e) => {
            expect(e).to.equal(err);
            done();
        };

        resolve(handler, callback, req);
        expect(handler).to.be.calledWith(req, callback);
    });

    it('should handle functions that resolve a value node-style', function(done) {
        const handler = sinon.spy((req, next) => next(null, null));
        const callback = (e) => {
            expect(e).to.equal(null);
            done();
        };

        resolve(handler, callback, req);
        expect(handler).to.be.calledWith(req, callback);
    });

    it('should handle functions that pass an error node-style', function(done) {
        const handler = sinon.spy((req, next) => next(err));
        const callback = (e) => {
            expect(e).to.equal(err);
            done();
        };

        resolve(handler, callback, req);
        expect(handler).to.be.calledWith(req, callback);
    });
});
