# `Ability`

The `Ability` class is the base of every Alexa skill. It is a a tool
that helps manage the middleware and intent handlers, as well as control
the overall lifecycle of a request from Amazon.

### Reference
 - [`constructor(options) -> ability`](#constructoroptions---ability)
 - [`use(...handlers) -> ability`](#usehandlers---ability)
 - [`on(event, ...handlers) -> ability`](#onevent-handlers---ability)
 - [`onError(handler) -> ability`](#onerrorhandler---ability)
 - [`handle(data, callback) -> request`](#handledata-callback---request)


### `constructor(options) -> ability`
The `Ability` constructor takes in a single optional options object as the
only arguments. The current supported options are:
 - `applicationId`: your applications ID. If included, only requests with a
    matching application ID will be allowed to interact with your skill. This
    is required to have your skill certified for the Alexa app store.


### `use(...handlers) -> ability`
Add a handler function to your ability. Handlers will be executed sequentially,
therefore the order handlers are added is important.

A handler function can accept either 2 or 3 arguments.

If the function accepts 2 (or less) arguments it will handle requests. The
arguments are:
- `req`: the request object
- `next`: a function to call when the middleware is finished or has failed. If
   this function is called with an error as its first argument, the error handler
   will immediately be called.

If the function accepts 3 arguments it will handle errors. The arguments are:
- `err`: the error being handled
- `req`: the request object
- `next`: a function to call when the handler is finished or has failed. You'll
  typically never need to use this.


##### Example
```js
app.use(function(req, next) {
    console.log('handle request 1');
    next();
});

app.use(function(err, req, next) {
    // there are no errors upstream, this error handler will be skipped
    console.log('handle error 1');
    next();
});

// uhoh, a wild error appeared
app.use((req, next) => next(new Error()));

app.use(function(req, next) {
    // there's an error upstream, this request handler will be skipped
    console.log('handle request 2');
    next();
});

app.use(function(err, req, next) {
    // upstream error! this function is called
    console.log('handle error 2');
    next();
});

// will output:
//   handle request 1
//   handle error 2
```


### `on(event, ...handlers) -> ability`
Add event handlers to your ability. This is simply a wrapper around `app.use()`,
except the passed handlers will only be called when the handled event matches
the given one.

See `ability.use()` for possible arguments.

##### Example
```js
app.on('MyIntent', function(req, next) {
    req.say('Hello World!').end();
});

// is equivalent to
app.use((req, next) => {
    if (req.handler === 'MyIntent') {
        req.say('Hello World!').end();
    } else {
        next();
    }
});
```


### `handle(data, callback) -> request`
Handle a request from Amazon. This function accepts two arguments:
 - `data`: The JSON body sent to your skill.
 - `callback`: A node-style callback to call when the request has finished or failed.
   The function will recieve to arguments:
   - `err`: An `Error` if there was an uncaught error, otherwise `null`.
   - `req`: The finished request object
