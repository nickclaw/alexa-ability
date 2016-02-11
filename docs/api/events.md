# `events`
This module exposes common and internal events as constants. Every ability must handle at least the `launch` and `end` event, but are
encouraged to implement most of the other events.

##### Internal Events
 - `events.unhandledEvent`:
   - Called if no event handler sent a response.
   - Can be caused by:
     - A weird request from Amazon.
     - You not handling the event sent to your skill.
     - Accidentally not ending a request.
 - `events.launch`
   - Corresponds to `LaunchRequest`
 - `events.end`
   - Corresponds to `SessionEndedRequest`

##### Amazon Intents
 - `events.cancel` - `"AMAZON.CancelIntent"`
 - `events.help` - `"AMAZON.HelpIntent"`
 - `events.no` - `"AMAZON.NoIntent"`
 - `events.yes` - `"AMAZON.YesIntent"`
 - `events.repeat` - `"AMAZON.RepeatIntent"`
 - `events.restart` - `"AMAZON.StartOverIntent"`
 - `events.stop` - `"AMAZON.StopIntent"`
