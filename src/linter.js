import pick from 'lodash.pick';

import Resolver from './resolver';
import {asArray} from './util';

const debug = require('debug')('flos:linter');

/**
 * The main function of a FlosLinter is linting a list of files, and storing the results.
 * The list of files is generated by the FileResolver, which uses glob patterns for locating
 * files and filters for removing unwanted items.
 */
class FlosLinter {

  /**
   * @param {string}   name     Name of the linter
   * @param {Object}   options  Options for this linter
   * @param {string[]} [options.include]       Glob patterns for fetchingincluding folders/files.
   * @param {boolean}  [options.printEarly]    Report errors and warnings as soon as possible.
   * @param {boolean}  [options.failEarly]     Fail early on fatal error or warning.
   * @param {boolean}  [options.failOnError]   Fail on error(s).
   * @param {boolean}  [options.failOnWarning] Fail on warning(s).
   * @param {string}   [options.cwd]           CWD (considered for relative filenames).
   * @param {string}   [options.dotfiles]      Process dot files
   * @param {boolean}  [options.ignore]        False disables use of the ignore filter.
   * @param {string}   [options.ignorePath]    The ignore file to use.
   * @param {string[]} [options.ignorePatterns] Patterns of files to ignore.
   */
  constructor(name, options = {}) {
    this.name = name;
    this.options = Object.assign({include: [], exclude: []}, options);
    this.errors = [];
    this.warnings = [];

    // Allow for a friendly pattern configuration
    this.options.include = asArray(this.options.include);
    this.options.exclude = asArray(this.options.exclude);

    debug('new linter', this.name, this.options);
  }

  /**
   * Allow user options to serve as base of the linter options, i.e. fill in the gaps
   * @param {object} userOptions User options
   */
  configure(userOptions) {
    this.options = Object.assign({}, userOptions, this.options);
  }

  /**
   * Start the lint operation.
   * @returns {Promise<FlosLinter>} a resolved promise with a reference to itself
   *          after succesfully finishing the lint operation
   */
  lint() {
    if (!this.resolver) {
      const resolverOptions = Object.assign({}, pick(this.options, [
        'cwd',
        'dotfiles',
        'include',
        'ignore'
      ]));
      this.resolver = this.createResolver(resolverOptions);
    }

    debug('Starting lint');
    return this.resolver.getFiles().then(files => {
      // debug('Files to lint', files);
      const report = this.flos(files);

      return this;
    });
  }

  flos(files) {
    debug('Flos %s files', files.length);
  }

  /**
   * Create a new resolver. By default, a new FileResolver is returned.
   * @param {object} opts Resolver options.
   * @returns {FileResolver} a new file resolver
   */
  createResolver(opts) {
    debug('Creating resolver with options %o', opts);
    return new Resolver(opts);
  }

  /**
   * @returns {string} the name of this linter
   */
  getName() {
    return this.name;
  }

  isPrintEarly() {
    return Boolean(this.options.printEarly);
  }

  isFailEarly() {
    return Boolean(this.options.failEarly);
  }

  isFailOnError() {
    return Boolean(this.options.failOnError);
  }

  isFailOnWarning() {
    return Boolean(this.options.failOnWarning);
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  hasWarnings() {
    return this.warnings.length > 0;
  }

}

export default FlosLinter;
