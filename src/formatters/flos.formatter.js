import chalk from 'chalk';

class CruiseFormatter {

  formatErrors(linter) {
    const subject = 'Errors from ' + linter.getName();
    const errs = linter.errors.reduce((prev, error) => {
      return prev + this.formatError(error);
    }, '');
    return subject + '\n' + errs;
  }

  formatError(error) {
    return error;
  }

  formatWarnings(linter) {
    const subject = 'Warnings from ' + linter.getName();
    const warnings = linter.warnings.reduce((prev, warn) => {
      return prev + this.formatWarning(warn);
    }, '');
    return subject + '\n' + warnings;
  }

  formatWarning(warning) {
    return warning;
  }

  formatFatals(fatalErrors, fatalWarnings) {
    const fatals = [];

    if (fatalErrors.length) {
      fatals.push(this.formatFatal(fatalErrors, 'error', 'errors'));
    }

    if (fatalWarnings.length) {
      fatals.push(this.formatFatal(fatalWarnings, 'warning', 'warnings', chalk.yellow));
    }

    let msg = chalk.red('Linting failed:') + chalk.white(' found ');
    fatals.forEach((fatal, index) => {
      if (index > 0) {
        msg += ', and ';
      }
      const nums = fatal.color(`${fatal.num} ${fatal.type}${fatal.num > 1 ? 's' : ''}`);
      msg += `${nums} in ${fatal.name}`;
    });

    return msg;
  }

  formatFatal(fatal, type, prop, color = chalk.red) {
    const num = fatal.map((linter) => linter[prop]).reduce((prev, curr) => prev + curr.length, 0);
    const lastIndex = fatal.length - 1;
    const linters = fatal.map((linter) => `${chalk.blue(linter.name)}`).reduce((prev, curr, index) => {
      if (index > 0) {
        return index === lastIndex ? `${prev} and ${curr}` : `${prev}, ${curr}`;
      }
      return curr;
    }, '');
    const name = `linter${lastIndex > 0 ? 's' : ''} ${linters}`;
    return {
      num,
      type,
      name,
      color
    };
  }
}

module.exports = CruiseFormatter;
