/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

import { Ability, events } from 'alexa-ability';
import { handleAbility } from 'alexa-ability-lambda-handler';
import { recipes } from './recipes';

// setup ability
const APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
const app = new Ability({
    applicationId: APP_ID
});

//
// Handle Amazon events
//

app.on(events.launch, function(req) {
    const speechText = "Welcome to the Minecraft Helper. You can ask a question like, what's the recipe for a chest? ... Now, what can I help you with.";
    const repromptText = "For instructions on what you can say, please say help me.";

    req.say(speechText).reprompt(repromptText).send();
});

app.on(events.stop, function(req) {
    req.say('Goodbye').send();
});

app.on(events.cancel, function(req) {
    req.say('Goodbye').end();
});

app.on(events.help, function(req) {
    const speechText = "You can ask questions about minecraft such as, what's the recipe for a chest, or, you can say exit... Now, what can I help you with?";
    const repromptText = "You can say things like, what's the recipe for a chest, or you can say exit... Now, what can I help you with?";

    req.say(speechText).reprompt(repromptText).send();
});


//
// Handle our events
//

app.on('RecipeIntent', function(req) {
    // try to get item
    const item = (req.slots.Item || "").toLowerCase();
    if (!item) {
        const speech = "I'm sorry, I currently do not know that recipe. What else can I help with?";
        return req.say(speech).send();
    }

    // try to get recipe
    const recipe = recipes[item];
    if (!recipe) {
        const speech = `I'm sorry, I currently do not know the recipe for ${itemName}. What else can I help with?`;
        return req.say(speech).send();
    }

    // tell user recipe
    const cardTitle = `Recipe for ${item}`;
    const cardContent = recipe;
    req.say(recipe).show(cardTitle, cardContent).end();
});

// export as lambda function
export const handler = handleAbility(app);
