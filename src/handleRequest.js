import debug from 'debug';
import { resolve } from './resolve';

const log = debug('alexa-ability:ability:handle');
const warnSent = () => console.warn( // eslint-disable-line no-console
    'Request already sent. Don\'t call "next" function after sending response.'
);

export function handleRequest(req, _stack, done) {
    const stack = [..._stack];
    let index = 0;

    function next(err) {
        if (req.sent) { // halt execution early if response has been sent
            warnSent();
            return;
        }

        // no more handlers? end
        if (index >= stack.length) {
            done(err);
            return;
        }

        // get next handling function
        const fn = stack[index++];
        const fnName = fn.name || fn.displayName || 'anonymous';

        // handle it correctly
        if (fn.length >= 3 && err) {
            // can handle error
            log(`executing error handler: <${fnName}>`);
            resolve(fn, next, err, req);
        } else if (fn.length < 3 && !err) {
            // all's well! try the handler
            log(`executing handler: <${fnName}>`);
            resolve(fn, next, req);
        } else {
            // not correct type of handler
            log(`skipping handler: <${fnName}>`);
            next(err);
        }
    }

    // start execution
    next();
}
