# alexa-ability [![Build Status](https://travis-ci.org/nickclaw/alexa-ability.svg?branch=master)](https://travis-ci.org/nickclaw/alexa-ability)

Create skills for the [Alexa Skills Kit](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit)

### Example

```js
/** @jsx ssml */

import { Ability, events } from 'alexa-ability';
import { handleAbility } from 'alexa-ability-lambda-handler';
import { ssml } from 'alexa-ssml';

const app = new Ability({
    applicationId: 'my-application-id'
});

// runs first for every request
app.use(function(req, next) {
    logRequest(req);
    next();
});

// handle LaunchRequest
ability.on(events.launch, function(req, next) {
    const speech = (
        <speak>
            Hello <pause time={100} /> world
        </speak>
    );

    req.say(speech).show('Hello, world!');
});

// handle SessionEndedRequest
ability.on(events.end, function(req, next) {
    console.log(`Session ended because: ${req.reason}`);
    req.send('Goodbye!');
});

// handle uncaught errors
ability.onError(function(err, req, next) {
    req.say('Uhoh, something went wrong');
});

// handle intent
ability.on('MeaningOfLifeIntent', function(req, next) {
    asyncRequest(function(err) {
        if (err) return next(err);
        req.say('42').end();
    });
});

// export as a lambda handler
export const handler = handleAbility(ability);
```

### API

#### Ability

##### `new Ability(options) -> ability`
Create a new ability. The options object supports the following properties:
 * `applicationId` - Defaults to `undefined`, but if included, only allows requests that have a matching `applicationId`.

##### `ability.use(...middleware) -> ability`
Add middleware to the ability. Each middleware function will be called in the order added. They will be called with a request instance as the first argument and a "next" function that must be called when the middleware is finished.

Example middleware:
```js
function exampleMiddleware(req, next) {
    isAllowed(function(err, isAllowed) {
        if (err) return next(err); // pass along error
        if (isAllowed) return next(); // do next middleware
        req.say("I'm sorry, Dave. I'm afraid I can't do that.").end();
    });
}
```

##### `ability.on(intent, ...handlers) -> ability`
Add an intent handler to the ability. The handler functions will be called with a request instance as the first argument and a "next" function to be called when the handler is done.

##### `ability.onError(handler) -> ability`
Add an error handler to the ability. This handler will be called with the error as the first argument, the request as the second, and the next function as the third.

##### `ability.handle(event, callback) -> request`
Handle an event, this function expects the JSON object from the Alexa request and a node style callback.

#### Request

##### `new Request(event) -> request`

##### `request.raw`
The original event object passed to the ability.

##### `request.sent`
A boolean indicating whether this request has been sent.
This will be true after the use calls `end`, `send`, or `fail` on the request instance.

##### `request.isNew`
A boolean value indicating whether this is a new session. Returns true for a new session or false for an existing session.

##### `request.isEnding`
A boolean value indicating whether this session is ending.
Returns true if the event type is `SessionEndedRequest`.

##### `request.reason`
A string value if `request.isEnding` is `true`. Can be one of three reasons:
 * `USER_INITIATED`: The user explicitly ended the session
 * `ERROR`: An error occurred that caused the session to end
 * `EXCEEDED_MAX_REPROMPTS`: The user either did not respond or responded with an utterance that did not match any of the intents defined in your voice interface.

##### `request.version`
The version specifier for the request with the value defined as: “1.0”

##### `request.session`
A map of key-value pairs. The attributes map is empty for requests where a new session has started with the attribute new set to true.

Any changes to the session object will be persisted.

##### `request.user`
An object that describes the user making the request. A user is composed of:
 * userId: A string that represents a unique identifier for the user who made the request. The length of this identifier can vary, but is never more than 255 characters.
 * accessToken: a token identifying the user in another system. This is only provided if the user has successfully linked their account.

##### `request.params` or `request.slots`
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

##### `request.say([type, ] value) -> request`
Indicate the speech to return to the user. Type can be `"text"` or `"ssml"`.
If you omit the type argument, the value will be assumed to `"text"` if a string,
or `"ssml"` if an [alexa-ssml](https://github.com/nickclaw/alexa-ssml) object.

##### `request.show(title, content) -> request`
Indicate the title and content to display as a card on the Alexa app.

#### `request.linkAccount() -> request`
Show an card on the Alexa app that prompts the user to authorize with your application.
In addition, you'll typically want to tell the user to check the Alexa app and close the session.

Example:
```js
const message = 'Check the Alexa app to authorize your account.';
app.use(function checkAccessTokenMiddleware(req, next) {
    validateAccessToken(req.user.accessToken, function(err, isValid) {
        if (err) return next(err); // unknown error, let error handler take over
        if (!isValid) return req.say(message).linkAccount().end(); // needs to link account
        next(); // valid, good to go
    });
})
```

##### `request.reprompt([type, ] value) -> request`
Indicate the reprompt speech to say to the user.
This will only be used if the your service keeps the session open after sending the response, but the user does not respond with anything that maps to an intent. Type can be `"text"` or `"ssml"`.
If you omit the type argument, the value will be assumed to `"text"` if a string,
or `"ssml"` if an [alexa-ssml](https://github.com/nickclaw/alexa-ssml) object.

If this is not set, the user is not re-prompted.

##### `request.end() -> undefined`
Indicate that the session should be ended by the response.
This function will also send the response.

##### `request.send() -> undefined`
Send the response.

##### `request.fail(err) -> undefined`
Fail. Immediately halts execution of all middleware and handlers.
Requests that are failed will skip the `"error"` handler completely. The argument passed to this function will be passed to the handling callback function.

##### `request.toJSON() -> Object`
Get a properly formatted response JSON response.

#### events

##### Internal Events
 * `events.unhandledEvent`: No event handler found
 * `events.launch`: Corresponds to `LaunchRequest`
 * `events.end`: Corresponds to `SessionEndedRequest`

##### Amazon Intents
 * `events.cancel = "AMAZON.CancelIntent"`
 * `events.help = "AMAZON.HelpIntent"`
 * `events.no = "AMAZON.NoIntent"`
 * `events.yes = "AMAZON.YesIntent"`
 * `events.repeat = "AMAZON.RepeatIntent"`
 * `events.restart = "AMAZON.StartOverIntent"`
 * `events.stop = "AMAZON.StopIntent"`
