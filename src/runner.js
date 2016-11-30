import FlosProcessor from './processor';

class FlosRunner {

  constructor(...linters) {
    if (linters.length === 1 && linters[0] instanceof Array) {
      this.linters = linters[0];
    } else {
      this.linters = linters;
    }
  }

  configure(opts) {
    this.linters.forEach((linter) => linter.configure(opts));
  }

  run (processor = new FlosProcessor()) {
    return Promise
      .all(this._lintPromises())
      .then((linters) => processor.process(linters))
      .catch((error) => {
        processor.error(error);
        return error;
      });
  }

  _lintPromises() {
    return this.linters.map((linter) => {
      try {
        return Promise.resolve(linter.lint() || linter);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  }
}

export default FlosRunner;
