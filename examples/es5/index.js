var ab = require('alexa-ability');
var Ability = ab.Ability;
var events = ab.events;
var handleAbility = require('alexa-ability-lambda-handler').handleAbility;


// create our skill
var app = new Ability({
    applicationId: 'my-application-id'
});


// add middleware function that run before every request
app.use(function(req, next) {
    console.log('Handling:', req);
    next();
});


// handle LaunchRequest - "Alexa, launch MyApp"
app.on(events.launch, function(req, next) {
    var cardTitle = 'Greetings';
    var cardContent = 'Hello world!';
    var speech = [
        '<speak>',
            'Hello <break time="100ms" /> world',
        '</speak>'
    ].join('');

    req.show(cardTitle, cardContent).say('ssml', speech).send();
});


// handle SessionEndedRequest - "Alexa stop"
app.on(events.end, function(req, next) {
    console.log(`Session ended because: ${req.reason}`);
    req.say('Goodbye!').end();
});


// handle custom intents
app.on('MeaningOfLifeIntent', function(req, next) {
    asyncRequest(function(err) {
        if (err) return next(err);
        req.say('42').end();
    });
});


// catches any unhandled requests
app.use(function(req, next) {
    req.say('I don\'t know what to say').end();
});


// gracefully handles any uncaught errors
app.use(function(err, req, next) {
    req.say('Uhoh, something went wrong').end();
});


// export as a lambda handler
module.exports.handler = handleAbility(app);
