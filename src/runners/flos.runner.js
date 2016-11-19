class FlosRunner {
  constructor(linters = []) {
    this.linters = linters;
  }

  configure(opts) {
    this.linters.forEach((linter) => linter.configure(opts));
  }

  run (handler) {
    console.log('Running flos!', this);
    Promise.all(this.linters.map((linter) => linter.lint()))
      .then(() => {
        console.log('Linting finished, generating report');

        const errors = this.linters.filter((linter) => linter.hasError());
        const warns = this.linters.filter((linter) => linter.hasWarning());

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
