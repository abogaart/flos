#!/usr/bin/env node

/* eslint-disable import/newline-after-import */
// must do this initialization *before* other requires in order to work
if (process.argv.indexOf('--debug') > -1) {
  require('debug').enable('flos:*');
}

const flos = require('../lib/api');

// Load config
const config = {};

// Load linters
const linters = [];

flos.run(linters, config);
