/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

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

/**
 * App ID for the skill
 */
const APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

const app = new Ability({
    applicationId: APP_ID
});

app.use(function(req, res) {
    if (req.isNew) {
        console.log('HelloWorld session started');
        // any initialization logic goes here
    }
    next();
});

app.on(events.launch, function(req) {
    console.log('HelloWorld onLaunch called');
    req.say('Welcome to the Alexa Skills Kit, you can say hello')
        .reprompt('You can say hello')
        .send();
});

app.on(events.end, function(req) {
    console.log('HelloWorld SessionEnded');
    // any cleanup logic goes here
});

app.on('HelloWorldIntent', function(req) {
    req.say('Hello World!')
        .show('Greeter', 'Hello World!')
        .end();
});

app.on('HelpIntent', function() {
    req.say('You can say hello to me!')
        .reprompt('You can say hello to me!')
        .send();
});

export const handler = handleAbility(app);
