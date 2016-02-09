/** @jsx ssml */

import { toSpeechResponse } from '../src/toSpeechResponse';
import { ssml } from 'alexa-ssml';

describe('toSpeechResponse', function() {

    it('should accept plain text as the only argument', function() {
        const result = toSpeechResponse('foo');
        expect(result).to.deep.equal({
            type: 'PlainText',
            text: 'foo'
        });
    });

    it('should accept an ssml object as the only argument', function() {
        const result = toSpeechResponse(<speak />);
        expect(result).to.deep.equal({
            type: 'SSML',
            ssml: '<speak/>'
        });
    });

    it('should accept type and plain text as the two arguments', function() {
        const result = toSpeechResponse('text', 'foo');
        expect(result).to.deep.equal({
            type: 'PlainText',
            text: 'foo'
        });
    });

    it('should accept type and plain ssml as the two arguments', function() {
        const result = toSpeechResponse('ssml', '<speak/>');
        expect(result).to.deep.equal({
            type: 'SSML',
            ssml: '<speak/>'
        });
    });

    it('should accept type and an ssml object as the two arguments', function() {
        const result = toSpeechResponse('ssml', <speak />);
        expect(result).to.deep.equal({
            type: 'SSML',
            ssml: '<speak/>'
        });
    });
});
