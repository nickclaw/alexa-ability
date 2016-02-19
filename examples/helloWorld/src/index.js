/**
 * This simple sample shows the most basic example of how to create a Lambda
 * function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

import { Ability, events } from 'alexa-ability';
import { handleAbility } from 'alexa-ability-lambda-handler';


// create ability
const APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
const app = new Ability({
    applicationId: APP_ID
});


// add middleware function to be called before every request
// you can use this to setup the request or log things
app.use(function(req, res) {
    // any initialization logic goes here
    // once we're done, call "next" to allow the next middleware or handler to run
    next();
});


// handle LaunchRequest - "Alexa, launch HelloWorld"
app.on(events.launch, function(req) {
    req.say('Welcome to the Alexa Skills Kit, you can say hello')
        .reprompt('You can say hello')
        .send();
});


// handle SessionEndedRequest - "Alexa stop"
app.on(events.end, function(req) {
    // any cleanup logic goes here
});


// handle AMAZON.HelpIntent
app.on(events.help, function(req) {
    req.say('You can say hello to me!')
        .reprompt('You can say hello to me!')
        .send();
});


// handle our skills custom intent (see SampleUtterances.txt)
app.on('HelloWorldIntent', function(req) {
    req.say('Hello World!')
        .show('Greeter', 'Hello World!')
        .end();
});


// export as a lambda function
export const handler = handleAbility(app);
