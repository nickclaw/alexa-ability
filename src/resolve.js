

export function resolve(fn, done, ...args) {
    try {
        fn(...args, done);
    } catch (e) {
        done(e);
    }
}
