
import FlosReporter from '../reporters/flos.reporter';

class FlosHandler {
  constructor(reporter = new FlosReporter()) {
    this.reporter = reporter;
  }

  finish(errors, warnings) {
    errors.forEach((linter) => this.reporter.error(linter));
    warnings.forEach((linter) => this.reporter.warning(linter));
  }

  exit(errors, warnings) {
    errors.forEach((linter) => this.reporter.error(linter));
    warnings.forEach((linter) => this.reporter.warning(linter));
    this.reporter.fatal(errors, warnings);
  }

  error(e) {
    this.reporter.exception(e);
  }
}

module.exports = FlosHandler;
