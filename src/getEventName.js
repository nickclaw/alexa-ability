import get from 'lodash/get';
import debug from 'debug';

const log = debug('alexa-ability:getEventName');

export function getEventName(event) {
    const type = get(event, 'request.type');
    log(`getting event name for request type: ${type}`);

    switch(type) {
        case "LaunchRequest":
            return "launch";

        case "IntentRequest":
            return get(event, 'request.intent.name');

        case "SessionEndedRequest":
            return "end";

        default:
            return "unhandledIntent";
    }
}
