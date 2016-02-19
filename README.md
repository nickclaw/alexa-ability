# alexa-ability [![Build Status](https://travis-ci.org/nickclaw/alexa-ability.svg?branch=master)](https://travis-ci.org/nickclaw/alexa-ability)

An [Alexa Skills Kit](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit) framework for node.
 - [Read the docs](docs/)
 - [View the examples](examples/)
 - [Contribute!](CONTRIBUTING.md)

### Features
 * Asynchronous middleware and intent handlers
 * Robust error handling
 * Easy access to session and slots data
 * Well tested
 * Integrates well with any framework

### Related packages
 * [alexa-ability-lambda-handler](https://npmjs.org/package/alexa-ability-lambda-handler) - Expose abilities as AWS Lambda functions
 * [alexa-ability-express-handler](https://npmjs.org/package/alexa-ability-express-handler) - Expose abilities as Express endpoints
 * [alexa-ability-timeout](https://npmjs.org/alexa-ability-timeout) - Middleware to prevent your skills from stalling.
 * [alexa-ability-context](https://npmjs.org/alexa-ability-context) - Middleware to simplify building multistep conversations.
 * [alexa-utterances](https://npmjs.org/package/alexa-utterances) - Easily generate an exhaustive list of utterances from a few template strings.
 * [alexa-ssml](https://npmjs.org/package/alexa-ssml) - Manipulate and validate SSML using the [jsx](https://facebook.github.io/react/docs/jsx-in-depth.html) syntax
 * [node-lambda](https://www.npmjs.com/package/node-lambda) - A command line interface to package and deploy AWS Lambda functions

### Example

```js
import { Ability, events } from 'alexa-ability';
import { handleAbility } from 'alexa-ability-lambda-handler';

// create our skill
const app = new Ability({
    applicationId: 'my-application-id'
});


// add middleware function that run before every request
app.use(function(req, next) {
    logRequest(req);
    next();
});


// handle LaunchRequest - "Alexa, launch MyApp"
ability.on(events.launch, function(req, next) {
    const cardTitle = 'Greetings';
    const cardContent = 'Hello world!';
    const speech = (`
        <speak>
            Hello <break time="100ms" /> world
        </speak>
    `);

    req.show(cardTitle, cardContent).say('ssml', speech).send();
});


// handle SessionEndedRequest - "Alexa stop"
ability.on(events.end, function(req, next) {
    console.log(`Session ended because: ${req.reason}`);
    req.say('Goodbye!').end();
});


// handle custom intents
ability.on('MeaningOfLifeIntent', function(req, next) {
    asyncRequest(function(err) {
        if (err) return next(err);
        req.say('42').end();
    });
});


// catches any unhandled requests
ability.use(function(req, next) {
    req.say('I don\'t know what to say').end();
});


// gracefully handles any uncaught errors
ability.use(function(err, req, next) {
    req.say('Uhoh, something went wrong').end();
});


// export as a lambda handler
export const handler = handleAbility(ability);
```
