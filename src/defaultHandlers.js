import debug from 'debug';
import once from 'lodash/once';

const dLog = debug('alexa-ability:defaultEventHandler');
const eLog = debug('alexa-ability:defaultErrorHandler');

const noErrHandlerWarning = once(() => console.warn( // eslint-disable-line no-console
    'Warning: Unhandled error. Add an error handler.'
));

export const defaultHandlers = {
    defaultHandler: function defaultIntentHandler(req, next) {
        dLog('unhandled request', req);
        next(new Error('No intent handler found.'));
    },

    errorHandler: function defaultErrorHandler(err, req, next) {
        eLog('unhandled error', err);
        noErrHandlerWarning();
        next(err);
    },
};
