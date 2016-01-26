import { resolve } from '../src/resolve';

const req = {};
const val = {};
const err = new Error();

describe('resolve(fn, ...args)', function() {

    it('should resolve a successful node style callback to a resolved promise', function() {
        function fn(req, done) {
            done(null, val);
        }

        const result = resolve(fn, req);
        expect(result).to.be.instanceOf(Promise);
        return result.should.eventually.equal(val);
    });

    it('should resolve failed node style callback to a rejected promise', function() {
        function fn(req, done) {
            done(err);
        }

        const result = resolve(fn, req);
        expect(result).to.be.instanceOf(Promise);
        return result.should.be.rejectedWith(err);
    })

    it('should resolve a resolved promise to a resolved promise', function() {
        function fn(req) {
            return Promise.resolve(val);
        }

        const result = resolve(fn, req);
        expect(result).to.be.instanceOf(Promise);
        return result.should.eventually.equal(val);
    });

    it('should resolve a rejected promise to a rejected promise', function() {
        function fn(req) {
            return Promise.reject(err);
        }

        const result = resolve(fn, req);
        expect(result).to.be.instanceOf(Promise);
        return result.should.be.rejectedWith(err);
    })

    it('should resolve a synchronous function to a promise', function() {
        function fn(req) {
            return val;
        }

        const result = resolve(fn, req);
        expect(result).to.be.instanceOf(Promise);
        return result.should.eventually.equal(val);
    });

    it('should catch synchronous errors and return a rejected promise', function() {
        function fn(req, done) {
            throw err;
        }

        const result = resolve(fn, req);
        expect(result).to.be.instanceOf(Promise);
        return result.should.be.rejectedWith(err);
    });
});
