import FlosFormatter from '../formatters/flos.formatter';

class FlosReporter {
  constructor(formatter = new FlosFormatter()) {
    this.formatter = formatter;
    this.errors = [];
    this.warnings = [];
  }

  error(linter) {
    if (linter.isPrintEarly()) {
      this.print(this.formatter.formatErrors(linter));
    } else {
        // TODO: add compact mode
      linter.errors.forEach((error) => {
        this.errors.push(this.formatter.formatError(error));
      });
    }
  }

  warning(linter) {
    if (linter.isPrintEarly()) {
      this.print(this.formatter.formatWarnings(linter));
    } else {
      // TODO: add compact mode
      linter.warnings.forEach((warning) => {
        this.warnings.push(this.formatter.formatWarning(warning));
      });
    }
  }

  fatal(errors, warnings) {
    throw new Error(this.formatter.formatFatals(errors, warnings));
  }

  exception(error) {
    this.print(this.formatter.formatException(error));
  }

  print(...str) {
    console.log(...str);
  }
}

module.exports = FlosReporter;
