import FlosHandler from '../handlers/flos.handler';

class FlosRunner {
  constructor(...linters) {
    this.linters = linters;
  }

  configure(opts) {
    this.linters.forEach((linter) => linter.configure(opts));
  }

  run (handler = new FlosHandler()) {
    return Promise.all(this.linters.map((linter) => linter.lint()))
      .then(() => {
        const errors = this.linters.filter((linter) => linter.hasErrors());
        const warns = this.linters.filter((linter) => linter.hasWarnings());

        if (errors.find((linter) => linter.isFailOnError() && linter.isFailEarly()) ||
             warns.find((linter) => linter.isFailOnError() && linter.isFailEarly())) {
          handler.exit(errors, warns);
        } else {
          handler.finish(errors, warns);
        }
      })
      .catch((error) => handler.error(error));
  }
}

module.exports = FlosRunner;
