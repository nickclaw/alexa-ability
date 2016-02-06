import get from 'lodash/get';
import debug from 'debug';

const log = debug('alexa-ability:verifyApplication');

export function verifyApplication(id) {
    return function applicationVerifier(req, next) {
        const appId = get(req, 'raw.session.application.applicationId');

        log('checking requests applicationId: %s', appId);

        // verify that applicationId is the same
        if (appId !== id) {
            log('invalid applicationId: %s (expected %s)', appId, id);
            return req.fail(new Error('Invalid applicationId'));
        }

        log('applicationId matches');
        next();
    };
}
