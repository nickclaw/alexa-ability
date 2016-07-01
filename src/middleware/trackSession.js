import get from 'lodash/get';


export function trackSession() {
    return function sessionTracker(req, next) {
        // monkey patch send to intercept response
        const _send = req.send;
        Object.defineProperty(req, 'send', {
            configurable: true,
            enumerable: false,
            writable: true,
            value: function send(res) {
                return _send.call(req, res.attributes(req.session));
            },
        });

        req.session = get(event, 'session.attributes', {});
        next();
    };
}
