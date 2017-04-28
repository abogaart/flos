import FlosProcessor from './processor';
import FlosReporter from './reporter';

const debug = require('debug')('flos:runner');

/**
 * Main entry point for starting a flos run. It runs all the linters and processes the results
 * with a FlosProcessor. The results are reported to the user with a FlosReporter.
 */
class FlosRunner {

  constructor(...linters) {
    // Allow argument to be native array
    if (linters.length === 1 && Array.isArray(linters[0])) {
      this.linters = linters[0];
    } else {
      this.linters = linters;
    }
  }

  configure(opts) {
    this.linters.forEach(linter => linter.configure(opts));
  }

  run(processor = new FlosProcessor(), reporter = new FlosReporter()) {
    debug('run', processor, reporter);
    return Promise
      .all(this._lintPromises())
      .then(linters => processor.process(linters, reporter))
      .catch(err => {
        reporter.exception(err);
        return err;
      });
  }

  _lintPromises() {
    return this.linters.map(linter => {
      try {
        return Promise.resolve(linter.lint() || linter);
      } catch (err) {
        return Promise.reject(err);
      }
    });
  }
}

export default FlosRunner;
