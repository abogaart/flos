import fs from 'fs';
import shell from 'shelljs';
import pathUtil from 'path-util';
import IgnoreFilter from './ignore.filter';

const debug = require('debug')('flos:ignore');

class IgnoreFileFilter extends IgnoreFilter {
  /**
   * @param {Object} options object containing 'cwd', 'dotfiles',
   *                 'ignore', 'ignorePath', 'ignoreFileName' and 'ignorePatterns' properties
   * @param {string} [options.ignorePath]  Path to the ignore file
   * @param {string} [options.ignoreFilename]  Filename of the ignore file
   */
  constructor(options) {
    super(options);

    const ignorePath = this.getIgnorePath();
    if (ignorePath) {
      debug(`Adding ${ignorePath}`);
      this.ignore.add(fs.readFileSync(ignorePath, 'utf8'));
    }
  }

  getIgnorePath() {
    if (this.options.ignorePath) {
      debug('Using specific ignore file', this.options.ignorePath);
      const ignoreFile = this.options.ignorePath;
      try {
        fs.statSync(ignoreFile);
        return ignoreFile;
      } catch (err) {
        err.message = `Cannot read ignore file: ${ignoreFile}\nError: ${err.message}`;
        throw err;
      }
    } else {
      const ignoreFile = pathUtil.toAbsolute(this.options.ignoreFilename, this.getBaseDir()) || '';
      debug(`Looking for ignore file with path ${ignoreFile}`);
      return shell.test('-f', ignoreFile) ? ignoreFile : false;
    }
  }
}

export default IgnoreFileFilter;
