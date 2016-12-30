import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import IgnoreFilter from './ignore.filter';

const debug = require('debug')('flos:ignore');

class IgnoreFileFilter extends IgnoreFilter {
  /**
   * @param {Object} options object containing 'cwd', 'dotfiles',
   *                 'ignore', 'ignorePath', 'ignoreFileName' and 'ignorePatterns' properties
   */
  constructor(options) {
    super(options);

    const ignorePath = this.getIgnorePath();
    if (ignorePath) {
      debug(`Adding ${ignorePath}`);
      this.baseDir = path.dirname(path.resolve(this.baseDir, ignorePath));
      debug(`Set baseDir to ${this.baseDir}`);
      this.addIgnoreFile(ignorePath);
    }
  }

  /**
   * add ignore file to node-ignore instance
   * @param {string} filePath, file to add to node-ignore
   * @returns {array} raw ignore rules
   */
  addIgnoreFile(filePath) {
    this.ignoreFiles.push(filePath);
    return this.ignore.add(fs.readFileSync(filePath, 'utf8'));
  }

  getIgnorePath() {
    let ignorePath;
    if (this.options.ignorePath) {
      debug('Using specific ignore file', this.options.ignorePath);

      const ignoreFile = this.options.ignorePath;
      try {
        fs.statSync(ignoreFile);
        ignorePath = ignoreFile;
      } catch (err) {
        err.message = `Cannot read ignore file: ${ignoreFile}\nError: ${err.message}`;
        throw err;
      }
    } else {
      ignorePath = this.findIgnoreFile();
      try {
        fs.statSync(ignorePath);
        debug(`Loaded ignore file ${ignorePath}`);
      } catch (err) {
        debug('Could not find ignore file in baseDir');
      }
    }
    return ignorePath;
  }

  /**
   * Find an ignore file in the current baseDir.
   * @returns {string} Path of ignore file or an empty string.
   */
  findIgnoreFile() {
    const ignoreFilePath = path.resolve(this.getBaseDir(), this.options.ignoreFileName || '');
    debug(`Looking for ignore file with path ${ignoreFilePath}`);
    return shell.test('-f', ignoreFilePath) ? ignoreFilePath : '';
  }

  getBaseDir() {
    return this.baseDir || super.getBaseDir();
  }

}

export default IgnoreFileFilter;
