import path from 'path';
import pathUtil from 'path-util';

const debug = require('debug')('flos:filter');

const DEFAULT_OPTIONS = {
  cwd: process.cwd(),
  trackFiltered: true
};

class Filter {

  /**
   * @param {Object} options        options for filter
   * @param {string} [options.cwd]  CWD (considered for relative filenames) should be absolute
   * @param {boolean} [options.trackFiltered]  set to true to store the path(s) of filtered files
   */
  constructor(options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.filtered = {}; // track filtered files

    this.setBaseDir(this.options.cwd);
  }

  /**
   * @param {string} absolutePath Absolute file path to check
   * @param {string} relativePath Relative path to check
   * @returns {boolean} true if the file should be filtered, false otherwise
   */
  filter(absolutePath, relativePath) {
    debug('filter', relativePath, absolutePath);
    return false;
  }

  /**
   * @param {string} filePath  The file path to apply to the filter. Should be *nix format.
   * @returns {boolean} true if the file should be filtered, false otherwise
   */
  apply(filePath) {
    if (!filePath || typeof filePath !== 'string' || filePath.trim().length === 0) {
      throw new Error('Expected filePath argument of type string');
    }

    const path = filePath.trim();
    const base = this.getBaseDir();
    const absolutePath = pathUtil.isAbsolute(path) ? path : pathUtil.toAbsolute(path, base);
    let relativePath;
    if (pathUtil.isBasePath(base, absolutePath)) {
      relativePath = pathUtil.toRelative(absolutePath, base);
    } else {
      relativePath = pathUtil.toRelative(pathUtil.getRoot(base), base) + absolutePath;
    }
    const isFiltered = this.filter(absolutePath, relativePath);

    if (isFiltered && this.options.trackFiltered) {
      this.track(absolutePath, relativePath);
    }
    return isFiltered;
  }

  setBaseDir(baseDir) {
    this.baseDir = pathUtil.canonicalize(path.resolve(baseDir));
  }

  /**
   * @returns the base dir for this filter, defaults to process.cwd()
   */
  getBaseDir() {
    return this.baseDir;
  }

  track(absolutePath, relativePath) {
    debug('track', relativePath);
    this.filtered[absolutePath] = true;
  }

  tracking(absolutePath) {
    return Boolean(this.filtered[absolutePath]);
  }
}

export default Filter;
