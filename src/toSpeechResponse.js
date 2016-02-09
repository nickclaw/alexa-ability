import get from 'lodash/get';
import { renderToString } from 'alexa-ssml';

/**
 * Takes content and an optional type arguments
 * and returns a valid outputSpeech object
 *
 * Examples:
 *   toSpeechResponse('hello world')
 *   toSpeechResponse(<speak/>)
 *   toSpeechResponse('text', 'hello world')
 *   toSpeechResponse('ssml', <speak/>)
 *   toSpeechResponse('ssml', '<speak/>')
 *
 * @param {String=} type - 'ssml' or 'text'
 * @param {SSML|String} content
 * @return {Object}
 */
export function toSpeechResponse(_type, _content) {
    const type = _content === undefined ? undefined : _type;
    const content = _content === undefined ? _type : _content;
    const isTag = !!get(content, 'tag');

    return isTag || type === 'ssml' ?
        { type: 'SSML', ssml: (isTag ? renderToString(content) : content) } :
        { type: 'PlainText', text: content };
}
