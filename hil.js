#!/usr/bin/env node

const path = require('path');
const labels = require('github-labels');

const repo = process.argv[2];

if (!/\w+\/\w+/.test(repo)) {
    console.error('You must provide user/repo as the 1st argument.');
    process.exit(1);
}

labels({
    config: path.join(__dirname, 'config.json'),
    args: [repo]
});
