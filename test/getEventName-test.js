import { getEventName } from '../src/getEventName';

const launchRequest = require('./fixtures/launch-request');
const intentRequest = require('./fixtures/intent-request');
const sessionEndedRequest = require('./fixtures/session-ended-request');
const unknownRequest = require('./fixtures/unknown-request');

describe('getEventName(event)', function() {

    it('should return "launch" for a "LaunchRequest" event', function() {
        const type = getEventName(launchRequest);
        expect(type).to.equal("launch");
    });

    it('should return the intent name for an IntentRequest', function() {
        const type = getEventName(intentRequest);
        expect(type).to.equal("GetZodiacHoroscopeIntent");
    });

    it('should return "end" for a "SessionEndedRequest" event', function() {
        const type = getEventName(sessionEndedRequest);
        expect(type).to.equal("end");
    });

    it('should return "unhandledIntent" for an unknown event', function() {
        const type = getEventName(unknownRequest);
        expect(type).to.equal("unhandledIntent");
    });
});
