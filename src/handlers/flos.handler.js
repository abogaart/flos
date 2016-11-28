
import FlosReporter from '../reporters/flos.reporter';

class FlosHandler {
  constructor(reporter = new FlosReporter()) {
    this.reporter = reporter;
  }

  ok(linters) {
    const errors = linters.filter((linter) => linter.hasErrors());
    const warns = linters.filter((linter) => linter.hasWarnings());

    if (errors.find((linter) => linter.isFailOnError() && linter.isFailEarly()) ||
          warns.find((linter) => linter.isFailOnWarning() && linter.isFailEarly())) {
      this.exit(errors, warns);
    } else {
      this.finish(errors, warns);
    }

  }

  finish(errors, warnings) {
    errors.forEach((linter) => this.reporter.error(linter));
    warnings.forEach((linter) => this.reporter.warning(linter));
    this.reporter.finish();
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
