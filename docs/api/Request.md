# `Request`
The `Request` class wraps around the JSON body sent by Amazon and
provides several methods to help build a valid response.

In addition to the documented methods, the `Request` class is an
`EventEmitter` and has all associated methods.

### Reference
 - [`constructor(data) -> request`](#constructordata---request)
 - [`properties`](#properties)
 - [`events`](#events)
 - [`say([type,] value) -> request`](#saytype-value---request)
 - [`show(title, content) -> request`](#showtitle-content---request)
 - [`linkAccount() -> request`](#linkaccount---request)
 - [`reprompt([type,] value) -> request`](#reprompttype-value)
 - [`tell() or end() -> undefined`](#tell-or-end---undefined)
 - [`ask() or send() -> undefined`](#ask-or-send---undefined)
 - [`fail(error) -> undefined`](#failerror---undefined)
 - [`toJSON() -> object`](#tojson---object)


### `constructor(data) -> request`
The Request constructor takes in a single object. The object should be
the exact JSON body sent to the request by Amazon.

### `properties`
A request instance has many properties that expose information about the
original request:

#### `handler`
A string representing the event being handled. This can be useful for middleware
that need to react differently when handling certain intents.

If there was no handler for the given request, `req.handler` will equal `"unhandledEvent"`.

##### example
```js
app.use(function(req, next) {
    // we don't want to log peoples secrets
    if (req.handler !== 'SaveSecretIntent') {
        logRequest(req);
    }
    next();
});

app.on('SaveSecretIntent', function(req) {
    saveToDatabase(req.slots.secret, function() {
        req.say('Saved!').end();
    });
});

// other handlers
```

#### `raw`
The original event object passed to the ability.

#### `sent`
A boolean indicating whether this request has been sent.
This will be true after the use calls `end`, `send`, or `fail` on the request instance.

#### `isNew`
A boolean value indicating whether this is a new session. Returns true for a new session or false for an existing session.

#### `isEnding`
A boolean value indicating whether this session is ending.
Returns true if the event type is `SessionEndedRequest`.

#### `reason`
A string value if `request.isEnding` is `true`. Can be one of three reasons:
 * `USER_INITIATED`: The user explicitly ended the session
 * `ERROR`: An error occurred that caused the session to end
 * `EXCEEDED_MAX_REPROMPTS`: The user either did not respond or responded with an utterance that did not match any of the intents defined in your voice interface.

#### `version`
The version specifier for the request with the value defined as: “1.0”

#### `session`
A map of key-value pairs. The attributes map is empty for requests where a new session has started with the attribute new set to true.

Any changes to the session object will be persisted.

#### `user`
An object that describes the user making the request. A user is composed of:
 * userId: A string that represents a unique identifier for the user who made the request. The length of this identifier can vary, but is never more than 255 characters.
 * accessToken: a token identifying the user in another system. This is only provided if the user has successfully linked their account.

#### `params` or `slots`
An object of key value pairs. Where the keys are the slot names.

For an intent like this:
```json
{
  "name": "GetZodiacHoroscopeIntent",
  "slots": {
    "ZodiacSign": {
      "name": "ZodiacSign",
      "value": "virgo"
    }
  }
}
```

The object will look like:
```json
{
    "ZodiacSign": "virgo"
}
```

### `events`
A request instance can emit several events:
 - `finished`: emitted when the request has sent.
 - `failed`:  emitted when the request has failed.


### `say([type,] value) -> request`
Set the `speechOutput` property on the response.

##### Arguments
 - `type`: `'ssml'` or `'text'`, defaults to `'text'`
 - `value`: A string representing the plain text or ssml to send.

### `show(title, content) -> request`
Set the `cardOutput` property on the response. Cannot be used
with the `linkAccount` method.

##### Arguments
 - `title`: The title of the card to display on the Alexa app
 - `content`: The content of the card to display on the Alexa app.

### `linkAccount() -> request`
Show a card on the Alexa app to link their account to your service. Cannot be used with the `show` method.

### `reprompt([type,] value)`
Set the `reprompt.speechOutput` property on the response.

##### Arguments
 - `type`: `'ssml'` or `'text'`, defaults to `'text'`
 - `value`: A string representing the plain text or ssml to send.

### `tell() or end() -> undefined`
Send the response, but indicate that the session has ended.

### `ask() or send() -> undefined`
Send the response, but indicate that the session has not ended.

### `fail(error) -> undefined`
Immediately fail with the given error. This will skip the error handler
completely.

##### Arguments
 - `error`: The error to fail with

### `toJSON() -> object`
Returns a JSON object that represents a valid response to the request.
