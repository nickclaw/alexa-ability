import debug from 'debug';
import once from 'lodash/once';

const log = debug('alexa-ability:defaultErrorHandler');

const noErrHandlerWarning = once(() => console.warn( // eslint-disable-line no-console
    'Warning: Unhandled error. Add an error handler.'
));

export const defaultHandlers = {
    errorHandler: function defaultErrorHandler(err, req, next) {
        log('unhandled error', err);
        noErrHandlerWarning();
        next(err);
    },
};
