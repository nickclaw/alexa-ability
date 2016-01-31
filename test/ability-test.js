import noop from 'lodash/noop';
import { Ability } from '../src/Ability';
import { Request } from '../src/Request';
import * as e from '../src/standardEvents';

const launchRequest = require('./fixtures/launch-request');
const unknownRequest = require('./fixtures/unknown-request');

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
            app.on(e.launch, function(){});
            const result = app.handle(launchRequest);
            expect(result).to.be.instanceOf(Promise);
        });

        it('should return a promise that resolves to a request when successful', function() {
            app.on(e.launch, function(){});
            return app.handle(launchRequest).should.be.fulfilled
                .then(req => expect(req).to.be.instanceOf(Request));
        });

        it('should return a promise that rejects when middleware fails', function() {
            const err = new Error();
            app.use(function(){ throw err });
            app.on(e.launch, function(){});
            return app.handle(launchRequest).should.be.rejected
                .then(err => expect(err).to.equal(err));
        });

        it('should attempt the error handler when middleware fails', function() {
            const err = new Error();
            const spy = sinon.spy();

            app.use(function(){ throw err });
            app.on(e.launch, function(){});
            app.on(e.error, spy);

            return app.handle(launchRequest)
                .then(() => expect(spy).to.have.been.called);
        });

        it('should attempt the error handler when the handler fails', function() {
            const err = new Error();
            const spy = sinon.spy();

            app.on(e.launch, function(){ throw err });
            app.on(e.error, spy);

            return app.handle(launchRequest)
                .then(() => expect(spy).to.have.been.called);
        });

        it('should use the "unknownEvent" handler for unknown events', function() {
            const spy = sinon.spy();

            app.on(e.unknownEvent, spy);

            return app.handle(unknownRequest)
                .then(() => expect(spy).to.have.been.called);
        });
    });
});
