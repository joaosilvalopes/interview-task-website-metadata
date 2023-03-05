import { js2xml } from 'xml-js';
import parseHtmlMetadata from './parseHtmlMetadata';

export default {
    json: (metadata: ReturnType<typeof parseHtmlMetadata>) => JSON.stringify(metadata, null, 4),
    xml: (metadata: ReturnType<typeof parseHtmlMetadata>) => js2xml({ metadata }, { compact: true, spaces: 4 })
};
