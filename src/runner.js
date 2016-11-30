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
    const promises = this.linters.map((linter) => {
      try {
        return Promise.resolve(linter.lint() || linter);
      } catch (e) {
        return Promise.reject(e);
      }
    });
    return Promise.all(promises)
    .then((linters) => processor.process(linters))
    .catch((error) => {
      processor.error(error);
      return error;
    });
  }
}

export default FlosRunner;
