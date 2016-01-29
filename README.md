# alexa-ability [![Build Status](https://travis-ci.org/nickclaw/alexa-ability.svg?branch=master)](https://travis-ci.org/nickclaw/alexa-ability)

Create skills for the [Alexa Skills Kit](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit)

### Example

```js
import { Ability, events } from 'alexa-ability';
import handle from 'alexa-ability-lambda-handler';
import { ssml } from 'alexa-ssml';

const app = new Ability();

app.use(function(req) {
    // middleware
});


ability.on(events.LAUNCH, function(req) {
    const speech = (
        <speak>
            Hello <pause time={100} /> world
        </speak>
    );

    req.say(speech).show('Hello, world!');
});


ability.on('MeaningOfLifeIntent', function(req, done) {
    // or return a promise
    asyncRequest(function(err) {
        if (err) return done(err);

        req.say('42').end();
        done();
    });
});


ability.on('error', function(req) {
    req.say('Uhoh, something went wrong');
});

export const handler = handle(app);
```
