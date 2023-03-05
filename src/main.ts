import yargs from 'yargs';
import { writeFile } from 'fs';
import { promisify } from 'util';

import parseHtmlMetadata from './parseHtmlMetadata';
import jsTo from './jsTo';

(async () => {
  const options = await yargs
    .option("url", {
      alias: "u",
      describe: "The url to fetch",
      type: "string",
      demandOption: true
    })
    .option("outputFile", {
      alias: "out",
      describe: "The path to the output",
      type: "string",
      demandOption: false
    })
    .option("outputFormat", {
      alias: "format",
      describe: "The format of the output file",
      type: "string",
      choices: ["json", "xml"],
      demandOption: false
    })
    .help(true)
    .argv;
  
  const url = options.url;
  const outputFormat = options.outputFormat || 'json';
  const outputFile = options.outputFile || ("./out." + outputFormat);

  const html = await fetch(url).then(res => res.text());

  const metadata = parseHtmlMetadata(html);

  const jsToOutputFormat = jsTo[outputFormat as 'json' | 'xml'];

  await promisify(writeFile)(outputFile, jsToOutputFormat(metadata));
})();
