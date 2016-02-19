
/**
 * A simple middleware function that wraps a handler
 * to only respond to the give event
 * @param {String} event
 * @param {Function} handler
 */
export function handleEvent(event, handler) {
    // return middleware function
    return function eventHandler(req, next) {
        return event === req.handler ?
            handler(req, next) :
            next();
    };
}
