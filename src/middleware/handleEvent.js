
/**
 * A simple middleware function that wraps a handler
 * to only respond to the give event
 * @param {String} event
 * @param {Function} handler
 */
export function handleEvent(event, handler) {
    const isMatch = req => req.handler === event;
    const isErrorHandler = handler.length >= 3;

    const fn = isErrorHandler ?
        (err, req, next) => isMatch(req) ? handler(err, req, next) : next() :
        (req, next) => isMatch(req) ? handler(req, next) : next();

    fn.displayName = handler.name; // for debug statements
    return fn;
}
