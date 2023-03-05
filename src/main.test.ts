import { readFile } from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';

import parseHtmlMetadata from './parseHtmlMetadata';
import jsTo from './jsTo';

const execFileP = promisify(execFile);
const readFileP = promisify(readFile);

describe('main', () => {
    it('should throw error if required option url is not provided', async () => {
        await expect(execFileP('node', ['./bin/main.js'])).rejects.toThrow('Missing required argument: url');
    });

    it('should throw error if option format has invalid value', async () => {
        await expect(execFileP('node', ['./bin/main.js', '--url=https://example.com', '--outputFormat=abc'])).rejects.toThrow('Invalid values');
    });

    it('should output metadata from a given url in json', async () => {
        await execFileP('node', ['./bin/main.js', '--url=https://example.com', '--outputFile=testOut.json', '--outputFormat=json']);

        const out = await readFileP('testOut.json');
        const html = await fetch('https://example.com').then((res) => res.text());

        expect(out.toString()).toEqual(jsTo.json(parseHtmlMetadata(html)));
    });

    it('should output metadata from a given url in xml', async () => {
        await execFileP('node', ['./bin/main.js', '--url=https://example.com', '--outputFile=testOut.xml', '--outputFormat=xml']);

        const out = await readFileP('testOut.xml');
        const html = await fetch('https://example.com').then((res) => res.text());

        expect(out.toString()).toEqual(jsTo.xml(parseHtmlMetadata(html)));
    });
});
