import Promise from 'bluebird';

export function resolve(fn, ...args) {
    if (fn.length <= args.length)
        return Promise.try(() => fn(...args));

    return new Promise(function(res, rej) {
        fn(...args, (err, val) => err ? rej(err) : res(val));
    });
}
