import debug from 'debug';
import once from 'lodash/once';
import * as e from './standardEvents';

const dLog = debug('alexa-ability:defaultEventHandler');
const uLog = debug('alexa-ability:unknownEventHandler');
const eLog = debug('alexa-ability:defaultErrorHandler');

const noErrHandlerWarning = once(() => console.warn( // eslint-disable-line no-console
    'Warning: Unhandled error. Add an error handler.'
));

export const handlers = {
    [e.unhandledEvent]: function defaultEventHandler(req, next) {
        dLog('unhandled request', req);
        next(new Error('No event handler found.'));
    },

    [e.unknownEvent]: function unknownEventHandler(req, next) {
        uLog('unknown request', req);
        next(new Error('Unknown request type.'));
    },

    [e.error]: function defaultErrorHandler(err, req, next) {
        eLog('unhandled error', err);
        noErrHandlerWarning();
        next(err);
    },
};
