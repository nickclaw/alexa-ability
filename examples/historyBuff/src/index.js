/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Web service: communicate with an external web service to get events for specified days in history (Wikipedia API)
 * - Pagination: after obtaining a list of events, read a small subset of events and wait for user prompt to read the next subset of events by maintaining session state
 * - Dialog and Session state: Handles two models, both a one-shot ask and tell model, and a multi-turn dialog model.
 * - SSML: Using SSML tags to control how Alexa renders the text-to-speech.
 *
 * Examples:
 * One-shot model:
 * User:  "Alexa, ask History Buff what happened on August thirtieth."
 * Alexa: "For August thirtieth, in 2003, [...] . Wanna go deeper in history?"
 * User: "No."
 * Alexa: "Good bye!"
 *
 * Dialog model:
 * User:  "Alexa, open History Buff"
 * Alexa: "History Buff. What day do you want events for?"
 * User:  "August thirtieth."
 * Alexa: "For August thirtieth, in 2003, [...] . Wanna go deeper in history?"
 * User:  "Yes."
 * Alexa: "In 1995, Bosnian war [...] . Wanna go deeper in history?"
 * User: "No."
 * Alexa: "Good bye!"
 */

/** @jsx ssml **/

import { Ability, events } from 'alexa-ability';
import { handleAbility } from 'alexa-ability-lambda-handler';
import { ssml, renderToString } from 'alexa-ssml';
import superagent from 'superagent';
import { wikipedia } from './wikipedia';


const APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
const urlPrefix = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&explaintext=&exsectionformat=plain&redirects=&titles=';
const paginationSize = 3;
const delimiterSize = 2;
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// create ability
const app = new Ability({
    applicationId: APP_ID
});


app.on(events.launch, function(req) {
    const cardTitle = "This Day in History";
    const cardOutput = "History Buff. What day do you want events for?";
    const repromptText = "With History Buff, you can get historical events for any day of the year.  For example, you could say today, or August thirtieth. Now, which day do you want?";
    const speechText = renderToString(
        <speak>
            <p>History buff</p>
            <p>What day do you want events for?</p>
        </speak>
    );

    req.show(cardTitle, cardOutput)
        .say('ssml', speechText)
        .reprompt(repromptText)
        .send();
});


app.on('GetFirstEventIntent', function(req, next) {
    const { day } = req.slots;

    // If the user provides a date, then use that, otherwise use today
    // The date is in server time, not in the user's time zone. So "today" for the user may actually be tomorrow
    const date = day && day.value ?
        new Date(day.value) :
        new Date();

    const month = monthNames(date.getMonth());
    getJsonEventsFromWikipedia(month, date.getDate(), function(err, events) {
        // if it failed, let error handler take care of it
        if (err) {
            return next(err);
        }

        // store list of all events for later
        req.session.events = events;

        // only show {paginationSize} events at a time
        events = events.slice(0, paginationSize);

        // store number of events already displayed
        req.session.offset = events.length;

        const speech = renderToString(
            <speak>
                <p>For {month} {date.getDate()},</p>
                {events.map(event => <p>{event}</p>)}
                <p>Want to go deeper in history?</p>
            </speak>
        );
        const reprompt = 'With History Buff, you can get historical events for any day of the year.  For example, you could say today, or August thirtieth. Now, which day do you want?';
        const title = `Events on ${month} ${date.getDate()}`;
        const content = events.join('. ') + '.';

        req.say('ssml', speech)
            .reprompt(reprompt)
            .show(title, content)
            .send();
    });
});



app.on('GetNextEventIntent', function(req) {
    const { offset, events } = req.session;
    const cardTitle = 'More events on this day in history';
    const repromptText = 'Do you want to know more about what happened on this date?';

    // if haven't called GetFirstEventIntent already
    if (!events) {
        const text = 'With History Buff, you can get historical events for any day of the year.  For example, you could say today, or August thirtieth. Now, which day do you want?';
        return req.say(text)
            .reprompt(repromptText)
            .show(cardTitle, text)
            .send();
    }

    // if there are no more events to share
    if (offset >= events.length) {
        const text = 'There are no more events for this date. Try another date by saying, get events for august thirtieth.';
        const speech = renderToString(
            <speak>
                There are no more events for this date. Try another date by saying
                <pause time={300} />
                get events for august thirtieth.
            </speak>
        );

        return req.say('ssml', speech)
            .reprompt(repromptText)
            .show(cardTitle, text)
            .send();
    }

    const showEvents = events.slice(offset, offset + paginationSize);
    req.session.offset += showEvents.length;

    const speech = renderToString(
        <speak>
            <p>For {month} {date.getDate()},</p>
            {showEvents.map(event => <p>{event}</p>)}
            <p>Want to go deeper in history?</p>
        </speak>
    );
    const cardContent = showEvents.join('. ') + '.';

    req.say('ssml', speech)
        .reprompt(repromptText)
        .show(cardTitle, cardContent)
        .send();
});


app.on(events.help, function(req) {
    const speechText = "With History Buff, you can get historical events for any day of the year. For example, you could say today, or August thirtieth, or you can say exit. Now, which day do you want?";
    const repromptText = "Which day do you want?";

    req.say(speechText).reprompt(repromptText).send();
});


app.on(events.stop, function(req) {
    req.say('Goodbye').end();
});


app.on(events.cancel, function(req) {
    req.say('Goodbye').end();
});


export const handler = handleAbility(app);
