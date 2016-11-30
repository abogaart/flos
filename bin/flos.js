#!/usr/bin/env node

const flos = require('../lib/api');
const FlosRunner = flos.Runner;

// load config
const config = {};
// load linters
const linters = [];
// create runner
const runner = new FlosRunner(linters);
// configure runner
runner.configure(config);
// flos
runner.run();
