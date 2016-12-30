import FlosFormatter from './formatter';

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
      this.errors.push(...linter.errors);
    }
  }

  warning(linter) {
    if (linter.isPrintEarly()) {
      this.print(this.formatter.formatWarnings(linter));
    } else {
      this.warnings.push(...linter.warnings);
    }
  }

  fatal(errors, warnings) {
    throw new Error(this.formatter.formatFatals(errors, warnings));
  }

  exception(error) {
    this.print(this.formatter.formatException(error));
    this.print('Flos finished with error(s)');
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }

  print(...str) {
    console.log(...str);
  }

  finish() {
    this.errors.forEach(error => this.print(this.formatter.formatError(error)));
    this.warnings.forEach(warning => this.print(this.formatter.formatWarning(warning)));
    this.print('Flos finished');
  }
}

export default FlosReporter;
