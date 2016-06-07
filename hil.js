#!/usr/bin/env node
'use strict';

const Pkg = require('./package.json');
const Path = require('path');
const Commander = require('commander');
const Labels = require('github-labels');

let repo;

Commander
    .version(Pkg.version)
    .arguments('<repository>')
    .option('--host <github host>', 'Github server host (for GHE).')
    .action((repository) => {
        if (!/\w+\/\w+/.test(repository)) {
            Commander.outputHelp();
            process.exit(1);
        }

        repo = repository;
    })
    .on('--help', () => {
        console.log('  Example:');
        console.log('    hil Marsup/hil');
        console.log('    hil --host my-own-ghe.host.com Marsup/hil');
    })
    .parse(process.argv);


const options = {
    config: Path.join(__dirname, 'config.json'),
    args: [repo],
    host: Commander.host
};

Labels(options);
