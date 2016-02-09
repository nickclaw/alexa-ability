
/**
 * Simple try catcher around a node-style async function
 *
 * @param {Function} fn
 * @param {Function} done - the node-style callback
 * @param {...*} args - any arguments
 */
export function resolve(fn, done, ...args) {
    try {
        fn(...args, done);
    } catch (e) {
        done(e);
    }
}
