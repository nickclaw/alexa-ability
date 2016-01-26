
export function getEventName(event) {
    switch(event.request.type) {
        case "LaunchRequest":
            return "launch";

        case "IntentRequest":
            return event.request.intent.name;

        case "SessionEndedRequest":
            return "end";

        default:
            return "unhandleIntent";
    }
}
