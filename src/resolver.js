import Debug from 'debug';
import globby from 'globby';
import pathUtil from 'path-util';

import IgnoreFilter from './filters/ignore.filter';
import { asArray } from './util';

const debug = Debug('flos:resolver');

/**
 * Adds `"*"` at the end of `"node_modules/"`,
 * so that subtle directories could be re-included by .gitignore patterns
 * such as `"!node_modules/should_not_ignored"`
 */
const DEFAULT_IGNORE_DIRS = [
  '/node_modules/*',
  '/bower_components/*'
];

const DEFAULT_EXCLUDE_DIRS = [
  'node_modules/**',
  'bower_components/**'
];

const DEFAULT_OPTS = {
  cwd: process.cwd(),
  ignore: true,
  noDir: true,
  ignoreDefault: DEFAULT_IGNORE_DIRS,
  excludeDefault: DEFAULT_EXCLUDE_DIRS,
};

/**
 * The resolver provides an interface for generating a list of files according to specified
 * glob patterns and path filters. It excludes folders like 'node_modules' form globbing and
 * by applying a default ignore filter and ensures correct handling of dotfiles.
 */
class Resolver {

  /**
   * @param   {object}   options                 File resolver options
   * @param   {string}   [options.cwd]           CWD (considered for relative filenames)
   * @param   {boolean}  [options.dotFiles]      Resolve hidden files
   * @param   {boolean}  [options.noDir]         Never return a folder in the result
   * @param   {string[]} [options.include]       Files/folders to include
   * @param   {string[]} [options.exclude]       Files/folders to exclude
   * @param   {string[]} [options.excludeDefault] Default files/folders to exclude
   * @param   {boolean}  [options.ignore]        Ignore configuration, false disables ignoring files
   * @param   {boolean}  [options.ignoreDefault]
   * @param   {string}   [options.ignoreFile]            Path to ignore-file for providing ignore rules
   * @param   {string}   [options.ignorePatterns]        Glob patterns for ignoring files
   */
  constructor(options) {
    const opts = Object.assign({}, DEFAULT_OPTS, options);

    this.filters =  opts.filters || [];
    this.include = asArray(opts.include).map((glob) => pathUtil.canonicalize(glob));
    this.exclude = asArray(opts.exclude).map((glob) => pathUtil.canonicalize(glob));

    opts.dotFiles = opts.dotFiles || this.globIncludesDotfiles(this.include);

    if (opts.excludeDefault && opts.excludeDefault.length) {
      this.exclude.push(...opts.excludeDefault);
    }

    if (opts.ignore) {
      if (opts.ignoreDefault) {
        debug('adding default ignore filter', opts.ignoreDefault);
        this.addFilter(new IgnoreFilter({
          ignorePatterns: opts.ignoreDefault,
          reportFiltered: false,
          dotfiles: opts.dotFiles
        }));
      }

      if (opts.ignorePatterns) {
        debug('adding ignore patterns filter');
        this.addFilter(new IgnoreFilter({
          ignorePatterns: opts.ignorePatterns,
          dotfiles: opts.dotFiles
        }));
      }
      // TODO: handle ignore file, do lookup by default
    }

    this.options = opts;

    debug('Created file resolver');
  }

  globIncludesDotfiles(globs) {
    return globs.reduce((result, pattern) => {
      return result || /(?:(?:^\.)|(?:[/\\]\.))[^/\\.].*/.test(pattern);
    }, false);
  }

  /**
   * @param {Filter} filter The filter to add
   */
  addFilter(filter) {
    this.filters.push(filter);
  }

  /**
   * Build a list of absolute filesnames on which flos will act.
   * Ignored files are excluded from the results, as are duplicates.
   *
   * @returns {Promise<string[]>} Resolved absolute filenames.
   */
  getFiles() {
    debug('get files from patterns', this.include);
    if (this.include.length === 0) {
      return Promise.resolve([]);
    }

    return this.glob(this.include).then((files) => {
      debug('Found %s files, running %s filter(s)', files.length, this.filters.length);
      return files.filter((file) => this.includeFile(file));
    });
  }

  /**
   * Execute the glob.
   * @param {string[]} patterns The patterns to glob
   * @returns {Promise<string[]>} a promise on a string array of found filenames
   */
  glob(patterns) {
    debug('Resolving glob', patterns);
    return globby(patterns, {
      cwd: this.options.cwd,
      ignore: this.exclude,
      dot: this.options.dotFiles,
      nodir: this.options.noDir
    });
  }

  /**
   * Check if provided file should be included.
   * @param {string} file Absolute path to file
   * @returns true if the file should be included, false otherwise
   */
  includeFile(filePath) {
    debug('Check file', filePath);
    return !this.filters.reduce((filtered, filter) => {
      return filtered || filter.apply(filePath);
    }, false);
  }
}

export default Resolver;
