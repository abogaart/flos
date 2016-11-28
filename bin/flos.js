#!/usr/bin/env node

/* eslint-disable no-var */
'use strict';

const flos = require('../lib/index');
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
