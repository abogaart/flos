
class FlosLinter {

  constructor(name, options = {}) {
    this.name = name;
    this.options = options;
    this.errors = [];
    this.warnings = [];
  }

  configure(opts) {
    this.options = Object.assign({}, opts, this.options);
  }

  lint() {
    console.log(`Linter ${this.name} is linting with opts=`, this.options);
    return Promise.resolve(this);
  }

  getName() {
    return this.name;
  }

  isPrintEarly() {
    return this.options.printEarly;
  }

  isFailEarly() {
    return this.options.failEarly;
  }

  hasError() {
    return this.errors.length > 0;
  }

  isFailOnError() {
    return this.options.failOnError;
  }

  hasWarning() {
    return this.warnings.length > 0;
  }

  isFailOnWarning() {
    return this.options.failOnWarning;
  }
}

module.exports = FlosLinter;
