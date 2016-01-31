import debug from 'debug';
import once from 'lodash/once';
import * as e from './standardEvents';

const dLog = debug('alexa-ability:defaultEventHandler');
const uLog = debug('alexa-ability:unknownEventHandler');
const eLog = debug('alexa-ability:defaultErrorHandler');

const noErrHandlerWarning = once(() => console.warn('Warning: Unhandled error. Add an error handler.'));

export const handlers = {
    [e.unhandledEvent]: function defaultEventHandler(req) {
        dLog('unhandled request', req);
        throw new Error("No event handler found.");
    },

    [e.unknownEvent]: function unknownEventHandler(req) {
        uLog('unknown request', req);
        throw new Error("Unknown request type.");
    },

    [e.error]: function defaultErrorHandler(err, req) {
        eLog('unhandled error', err);
        noErrHandlerWarning();
        throw err;
    }
};
