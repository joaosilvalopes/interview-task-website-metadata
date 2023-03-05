import { JSDOM } from 'jsdom';

const getTreeDepth = (root: Element): number => root.childElementCount > 0 ? Math.max(...Array.from(root.children).map((child) => getTreeDepth(child))) + 1 : 0;

type ParsedHtmlMetadata = {
  tagCount: { [key: string]: number },
  tagDetails: {
    attributes: { [key: string]: string },
    tagName: string,
    childTagNames: string,
    depth: number
  }[]
};

function parseHtmlMetadata(html: string) {
  const out: ParsedHtmlMetadata = {
    tagCount: {},
    tagDetails: []
  };

  const { document } = new JSDOM(html).window;
  const elements = Array.from(document.querySelectorAll('*'));

  for (const element of elements) {
    const tagName = element.tagName.toLowerCase();

    out.tagCount[tagName] = (out.tagCount[tagName] || 0) + 1;
    out.tagDetails.push({
      tagName,
      depth: getTreeDepth(element),
      childTagNames: Array.from(element.children).map((child) => `<${child.tagName.toLowerCase()}>`).join(', '),
      attributes: Array.from(element.attributes).reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {}),
    });
  };

  return out;
}

export default parseHtmlMetadata;
