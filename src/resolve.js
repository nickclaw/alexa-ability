
export function resolve(fn, ...args) {
    if (fn.length <= 1)
        return Promise.resolve(fn(...args));

    return new Promise(function(res, rej) {
        fn(...args, err => err ? rej(err) : res());
    });
}
