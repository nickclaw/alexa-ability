
/**
 * Takes content and an optional type arguments
 * and returns a valid outputSpeech object
 *
 * Examples:
 *   toSpeechResponse('hello world')
 *   toSpeechResponse('text', 'hello world')
 *   toSpeechResponse('ssml', '<speak/>')
 *
 * @param {String=} type - 'ssml' or 'text'
 * @param {SSML|String} content
 * @return {Object}
 */
export function toSpeechResponse(_type, _content) {
    const type = _content === undefined ? 'text' : _type;
    const content = _content === undefined ? _type : _content;

    return type === 'ssml' ?
        { type: 'SSML', ssml: content } :
        { type: 'PlainText', text: content };
}
