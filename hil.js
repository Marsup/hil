#!/usr/bin/env node
'use strict';

const Commander = require('commander');
const GithubLabelSync = require('github-label-sync');

const LabelsConfig = require('./config.json');
const Pkg = require('./package.json');

let repo;

Commander
    .version(Pkg.version)
    .arguments('<repository>')
    .option('--host <github host>', 'Github server host (for GHE).')
    .option('--token <github token>', 'Github token')
    .option('-d, --dry', 'Dry run')
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


const applyLabels = async () => {
    const options = {
        accessToken: Commander.token,
        allowAddedLabels: true,
        dryRun: Commander.dry || false,
        endpoint: Commander.host,
        labels: LabelsConfig,
        repo
    };

    const diff = await GithubLabelSync(options);

    const added = diff.filter(d => d.type === 'missing');
    const updated = diff.filter(d => d.type === 'changed');

    if (added.length) {
        console.log(`${Commander.dry ? 'Will add' : 'Added'} ${added.map(l => l.name).join(', ')}`);
    }

    if (updated.length) {
        console.log(`${Commander.dry ? 'Will change' : 'Changed'} ${updated.map(l => {
            const changes = [l.actual.name !== l.expected.name ? 'name' : false, l.actual.color !== l.expected.color ? 'color' : false]
            return `${l.name} (${changes.filter(Boolean).join(', ')})`
        }).join(', ')}`);
    }

    console.log('Done!');
};

applyLabels().catch(err => {
    console.error(err);
    process.exit(1);
});
