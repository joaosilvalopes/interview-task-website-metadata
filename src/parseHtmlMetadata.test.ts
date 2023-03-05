import { join } from 'path';
import { readFileSync } from 'fs';
import parseHtmlMetadata from './parseHtmlMetadata';

const data = ['small', 'medium', 'large'].map((name) => ({
  name,
  input: readFileSync(join(__dirname, `testData/${name}.html`)).toString(),
  expectedOutput: JSON.parse(readFileSync(join(__dirname, `testData/${name}.json`)).toString()),
}));

const expectArrayEqualsIgnoreOrder = <T>(actual: T[], expected: T[]) => {
  expect(actual).toEqual(expect.arrayContaining(expected));
  expect(expected).toEqual(expect.arrayContaining(actual));
};

const testParseHtmlMetadata = (input: string, expectedOutput: ReturnType<typeof parseHtmlMetadata>) => {
  const metadata = parseHtmlMetadata(input);

  expect(metadata.tagDetails).toEqual(expectedOutput.tagDetails);
  expectArrayEqualsIgnoreOrder(metadata.tagDetails, expectedOutput.tagDetails);
};

describe('parseHtmlMetadata', () => {
  for(const { name, input, expectedOutput } of data) {
    it(`should parse html metadata correctly (${name})`, () => {
      testParseHtmlMetadata(input, expectedOutput);
    })
  }
});
