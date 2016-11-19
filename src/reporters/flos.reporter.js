import chalk from 'chalk';

import FlosFormatter from '../formatters/flos.formatter';

class FlosReporter {
  constructor(formatter = new FlosFormatter()) {
    this.formatter = formatter;
    this.errors = [];
    this.warnings = [];
  }

  error(linter) {
    if (linter.isPrintEarly()) {
      console.log(this.formatter.formatErrors(linter));
    } else {
        // TODO: add compact mode
      linter.errors.forEach((error) => {
        this.errors.push(this.formatter.formatError(error));
      });
    }
  }

  warning(linter) {
    if (linter.isPrintEarly()) {
      console.log(this.formatter.formatWarnings(linter));
    } else {
      // TODO: add compact mode
      linter.warnings.forEach((warning) => {
        this.warnings.push(this.formatter.formatWarning(warning));
      });
    }
  }

  throwFatalError(errors, warnings) {
    throw new Error(this.formatter.formatFatals(errors, warnings));
  }

  printError(error) {
    console.log(chalk.red(error.stack ? error.stack : error));
  }
}

module.exports = FlosReporter;
