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

app.use(function(req, next) {
    logRequest(req);
    next();
});

ability.on(events.launch, function(req) {
    const speech = (
        <speak>
            Hello <pause time={100} /> world
        </speak>
    );

    req.say(speech).show('Hello, world!');
});


ability.on('MeaningOfLifeIntent', function(req, next) {
    asyncRequest(function(err) {
        if (err) return next(err);
        req.say('42').end();
    });
});


ability.on(events.error, function(err, req, next) {
    req.say('Uhoh, something went wrong');
});

export const handler = handleAbility(ability);
```

### API

#### Ability

##### `new Ability(options) -> ability`
Create a new ability. The options object supports the following properties:

 * `applicationId` - Defaults to `undefined`, but if included, only allows requests that have a matching `applicationId`.

##### `Ability.prototype.use(handler) -> ability`
Add middleware to the ability. Middleware will be called in the order added. Each middleware function will be called with a request instance as the first argument and a "next" function that must be called when the middleware is finished.

If the middleware

```js
function exampleMiddleware(req, next) {
    isAllowed(function(err, isAllowed) {
        if (err) return next(err); // pass along error
        if (isAllowed) return next(); // do next middleware
        req.say("I'm sorry, Dave. I'm afraid I can't do that.").end();
    });
}
```

##### `Ability.prototype.on(event, handler) -> ability`
Add an event handler to the ability. The handler function will be called with a request instance as the first argument and a "next" function that can be used to pass errors down.

##### `Ability.prototype.handle(event, callback) -> request`
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

##### Default Events
 * `events.unhandledEvent`: No event handler found
 * `events.unknownEvent`: Handle unknown request types
 * `events.error`: Handle all errors
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
