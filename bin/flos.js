#!/usr/bin/env node

/* eslint-disable import/newline-after-import */
// must do this initialization *before* other requires in order to work
if (process.argv.indexOf('--debug') > -1) {
  require('debug').enable('flos:*');
}

const os = require('os');
const meow = require('meow');
const cosmiconfig = require('cosmiconfig');
const merge = require('lodash.merge');
const pick = require('lodash.pick');
const debug = require('debug')('flos:bin');

const flos = require('../lib/api');

const defaultConfig = {
  fire: false
};

const cli = meow(`
    Usage
      $ flos <input>

    Options
      --help              Show help message
      --version           Show flos version
      -f, --fire          Include fire
      -c, --configFile   Specify config file

    Examples
      $ flos unicorns --rainbow
`, {
  alias: {
    c: 'configFile',
    f: 'fire'
  }
});

debug('CLI flags:', cli.flags);

// console.log('cli', cli);
const loadHomeConfig = () => {
  const homeDir = os.homedir();
  const homeConfig = cosmiconfig('flos', {
    rc: '.flos',
    rcExtensions: true,
    stopDir: homeDir
  });
  return homeConfig.load(homeDir);
};

const loadCwdConfig = () => {
  const cwdConfig = cosmiconfig('flos', {
    rc: '.flos',
    rcExtensions: true
  });
  return cwdConfig.load(process.cwd(), cli.flags.configFile);
};

const start = config => {
  const linters = [];
  flos.run(linters, config);

  if (cli.flags.fire) {
    console.log('🚒 ⛑ the ground is on fire 🔥🔥🔥');
  }
};

Promise.all([loadHomeConfig(), loadCwdConfig()])
.then(configs => {
  configs = configs.map(config => {
    if (config) {
      if (typeof config.config === 'object') {
        return config.config;
      }
      throw new TypeError('Configuration is not an object');
    }
    return null;
  });

  debug('Configurations:', configs);

  // merge config
  const config = defaultConfig;
  merge(config, ...configs, pick(cli.flags, 'fire'));
  debug('Merged configuration:', config);
  start(config);
})
.catch(err => {
  console.log('Failed to load flos configuration');
  debug(err);
  process.exit(1);
});
