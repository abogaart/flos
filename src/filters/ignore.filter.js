/**
 * @fileoverview Loads ignore config files and manages ignore patterns
 * Based on the work of Jonathan Rajavuori and the ESLint team
 */

import ignore from 'ignore';

import Filter from './filter';

const debug = require("debug")("flos:ignore");

const DEFAULT_OPTIONS = {
  dotfiles: false,
};

class IgnoreFilter extends Filter {

  /**
   * @param {Object} options object containing 'cwd', 'dotfiles',
   *                 'ignore' and 'ignorePatterns' properties
   * @param {string} [options.cwd]  CWD (considered for relative filenames)
   */
  constructor(options) {
    super(Object.assign({}, DEFAULT_OPTIONS, options));

    this.ignore = ignore();

    const opts = this.options;
    if (opts.dotfiles !== true) {
      // ignore files beginning with a dot, but not files in a parent or
      // ancestor directory (which in relative format will begin with `../`).
      this.addPattern(['.*', '!../']);
    }

    if (opts.ignorePatterns) {
      debug(`Adding patterns from options ${opts.ignorePatterns}`);
      this.addPattern(opts.ignorePatterns);
    }
  }

  /**
   * add pattern to node-ignore instance
   * @param {string} pattern, pattern do add to node-ignore
   * @returns {array} raw ignore rules
   */
  addPattern(pattern) {
    this.ignore.addPattern(pattern);
  }

  /**
   * @param {string} absolutePath Absolute path to check
   * @param {string} relativePath Relative path to check
   * @returns {boolean} true if the file path should be filtered, false otherwise
   */
  filter(absolutePath, relativePath) {
    return this.ignore.filter([relativePath]).length === 0;
  }

}

export default IgnoreFilter;
