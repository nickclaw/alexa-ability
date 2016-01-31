# alexa-ability [![Build Status](https://travis-ci.org/nickclaw/alexa-ability.svg?branch=master)](https://travis-ci.org/nickclaw/alexa-ability)

Create skills for the [Alexa Skills Kit](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit)

### Example

```js
/** @jsx ssml */

import { Ability, events } from 'alexa-ability';
import handle from 'alexa-ability-lambda-handler';
import { ssml } from 'alexa-ssml';

const app = new Ability();

app.use(function(req, next) {
    logRequest(req);
    next();
});

ability.on(events.LAUNCH, function(req) {
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


ability.on('error', function(err, req, next) {
    req.say('Uhoh, something went wrong');
});

export const handler = handle(app);
```

### API

#### Ability

##### `new Ability(options) -> ability`

##### `Ability.prototype.use(handler) -> ability`

##### `Ability.prototype.on(event, handler) -> ability`

##### `Ability.prototype.handle() -> promise`

#### Request

##### `new Request(event) -> request`

##### `Request.prototype.say(text|ssml) -> request`

##### `Request.prototype.show(title, content) -> request`

##### `Request.prototype.reprompt(text|ssml) -> request`

##### `Request.prototype.end() -> undefined`

##### `Request.prototype.send() -> undefined`

##### `Request.prototype.toJSON() -> Object`

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
