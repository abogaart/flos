import FlosProcessor from './processor';
import FlosReporter from './reporter';

/**
 * Main entry point for starting a flos run. It runs all the linters and processes the results
 * with a FlosProcessor. The results are reported to the user with a FlosReporter.
 */
class FlosRunner {

  constructor(...linters) {
    if (linters.length === 1 && linters[0] instanceof Array) {
      this.linters = linters[0];
    } else {
      this.linters = linters;
    }
  }

  configure(opts) {
    this.linters.forEach(linter => linter.configure(opts));
  }

  run (processor = new FlosProcessor(), reporter = new FlosReporter()) {
    return Promise
      .all(this._lintPromises())
      .then(linters => processor.process(linters, reporter))
      .catch(error => {
        reporter.exception(error);
        return error;
      });
  }

  _lintPromises() {
    return this.linters.map(linter => {
      try {
        return Promise.resolve(linter.lint() || linter);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  }
}

export default FlosRunner;
