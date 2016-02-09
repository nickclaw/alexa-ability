import get from 'lodash/get';
import { renderToString } from 'alexa-ssml';

export function toSpeechResponse(_type, _content) {
    const type = _content === undefined ? undefined : _type;
    const content = _content === undefined ? _type : _content;
    const isTag = !!get(content, 'tag');

    return isTag || type === 'ssml' ?
        { type: 'SSML', ssml: (isTag ? renderToString(content) : content) } :
        { type: 'PlainText', text: content };
}
