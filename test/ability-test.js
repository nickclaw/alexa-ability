import { Ability } from '../src/Ability';
import { Request } from '../src/Request';
import noop from 'lodash/noop';

const launchRequest = require('./fixtures/launch-request');

describe('Ability', function() {

    let app = null;

    beforeEach(function() {
        app = new Ability();
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
        it('should return a promise', function() {
            const result = app.handle(launchRequest);
            expect(result).to.be.instanceOf(Promise);
        });

        it('should return a promise that resolves to a request when successful', function() {
            return app.handle(launchRequest).should.be.fulfilled
                .then(req => expect(req).to.be.instanceOf(Request));
        });

        it('should return a promise that rejects when middleware fails', function() {
            const err = new Error();
            app.use(function(){ throw err });
            return app.handle(launchRequest).should.be.rejected
                .then(err => expect(err).to.equal(err));
        });
    });
});
