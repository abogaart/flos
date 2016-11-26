
class FlosLinter {

  constructor(name, options = {}) {
    this.name = name;
    this.options = Object.assign({}, options);
    this.errors = [];
    this.warnings = [];
  }

  configure(opts) {
    this.options = Object.assign({}, opts, this.options);
  }

  lint() {
    return Promise.resolve(this);
  }

  getName() {
    return this.name;
  }

  isPrintEarly() {
    return !!this.options.printEarly;
  }

  isFailEarly() {
    return !!this.options.failEarly;
  }

  isFailOnError() {
    return !!this.options.failOnError;
  }

  isFailOnWarning() {
    return !!this.options.failOnWarning;
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  hasWarnings() {
    return this.warnings.length > 0;
  }

}

module.exports = FlosLinter;
