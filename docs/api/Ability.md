# `Ability`

The `Ability` class is the base of every Alexa skill. It is a a tool
that helps manage the middleware and intent handlers, as well as control
the overall lifecycle of a request from Amazon.

### Reference
 - [`constructor(options) -> ability`](#constructoroptions---ability)
 - [`use(...middleware) -> ability`](#usemiddleware---ability)
 - [`on(event, ...handlers) -> ability`](#onevent-handlers---ability)
 - [`onError(handler) -> ability`](#onerrorhandler---ability)
 - [`handle(data, callback) -> request`](#handledata-callback---request)


### `constructor(options) -> ability`
The `Ability` constructor takes in a single optional options object as the
only arguments. The current supported options are:
 - `applicationId`: your applications ID. If included, only requests with a
    matching application ID will be allowed to interact with your skill. This
    is required to have your skill certified for the Alexa app store.


### `use(...middleware) -> ability`
Add middleware functions to your ability. Middleware is called one at a time
in the order added before any event handler is called. Calling this function
multiple times will __add__ middleware, not replace previously added middleware.

Each middleware function must accept two arguments:
 - `req`: the request Object
 - `next`: a function to call when the middleware is finished or has failed. If
    this function is called with an error as its first argument, the error handler
    will immediately be called.

##### Example
```js
app.use(function(req, next) {
    // we can do things asynchronously!
    validateRequest(req, function(err, isValid) {
        // let error handler handle any errors
        if (err) return next(err);

        // you can send responses from here
        if (!isValid) {
            res.say('Invalid.').end();
            return; // just make sure not to call "next" if you do
        }

        // move on
        next();
    });
});
```


### `on(event, ...handlers) -> ability`
Add event handlers to your ability. You can also add event specific middleware
this way. Calling this function multiple times will __add__ handlers, not replace
previously added handlers.

Each handler function must accept two arguments:
 - `req`: the request Object
 - `next`: a function to call when the handler is finished or has failed. If this
   function is called with an error as its first argument, the error handler will
   immediately be called.

##### Example
```js

// intent specific middleware
function logRequestMiddleware(req, next) {
    console.log(req.raw);
    next();
}

// handler
function handleIntent(req, next) {
    req.say('Hello World!').end();
}

app.on('MyIntent', logRequestMiddleware, handleIntent);
```


### `onError(handler) -> ability`
Add a general error handler to your ability. Calling this function multiple times
will __replace__ the previously added error handler, not append it. Typically your
error handler should be very simple, and gracefully tell the user that there was was
a problem.

Each error handling function must accept three arguments:
 - `err`: the error being handled
 - `req`: the request Object
 - `next`: a function to call when the handler is finished or has failed. You'll
   typically never need to use this.


### `handle(data, callback) -> request`
Handle a request from Amazon. This function accepts two arguments:
 - `data`: The JSON body sent to your skill.
 - `callback`: A node-style callback to call when the request has finished or failed.
   The function will recieve to arguments:
   - `err`: An `Error` if there was an uncaught error, otherwise `null`.
   - `req`: The finished request object
