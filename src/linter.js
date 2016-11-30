
class FlosLinter {

  constructor(name, options = {}) {
    this.name = name;
    this.options = Object.assign({}, options);
    this.errors = [];
    this.warnings = [];
  }

  configure(userOptions) {
    this.options = Object.assign({}, userOptions, this.options);
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

export default FlosLinter;
