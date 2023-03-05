import { JSDOM } from 'jsdom';

const getTreeDepth = (root: Element): number => root.childElementCount > 0 ? Math.max(...Array.from(root.children).map((child) => getTreeDepth(child))) + 1 : 0;

type ParsedHtmlMetadata = {
  tagCount: { [key: string]: number },
  tagDetails: {
    attributes: { [key: string]: string },
    tagName: string,
    childTagNames: string,
    depth: number
  }[],
  resources: {
    type: string,
    src: string
  }[]
};

const externalResourceTagNames = new Set(['img', 'script', 'source']);

/**
 * Parses html metadata
 *
 * @param html - The input html string
 * @returns the parsed data
 */
const parseHtmlMetadata = (html: string) => {
  const out: ParsedHtmlMetadata = {
    tagCount: {},
    tagDetails: [],
    resources: []
  };

  const { document } = new JSDOM(html).window;
  const elements = Array.from(document.querySelectorAll('*'));

  for (const element of elements) {
    const tagName = element.tagName.toLowerCase();
    const attributes = Array.from(element.attributes).reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {});

    if(externalResourceTagNames.has(tagName)) {
      const { src, type, srcset } = attributes as any;
      const resourceSrc = src || srcset;

      resourceSrc && out.resources.push({
        type: type || tagName,
        src: resourceSrc,
      });
    }

    out.tagCount[tagName] = (out.tagCount[tagName] || 0) + 1;
    out.tagDetails.push({
      tagName,
      attributes,
      depth: getTreeDepth(element),
      childTagNames: Array.from(element.children).map((child) => child.tagName.toLowerCase()).join(', '),
    });
  };

  return out;
}

export default parseHtmlMetadata;
