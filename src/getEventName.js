import get from 'lodash/get';

export function getEventName(event) {
    switch(get(event, 'request.type')) {
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
