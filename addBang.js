const { writeFileSync, readFileSync } = require('fs');

const bang = '#! /usr/bin/env node\n';

writeFileSync('./bin/main.js', bang + readFileSync('./bin/main.js'));
