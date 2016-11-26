class FlosRunner {
  constructor(...linters) {
    this.linters = linters;
  }

  configure(opts) {
    this.linters.forEach((linter) => linter.configure(opts));
  }

  run (handler) {
    const promises = this.linters.map((linter) => {
      try {
        return Promise.resolve(linter.lint());
      } catch (e) {
        return Promise.reject(e);
      }
    });
    return Promise.all(promises)
    .then(() => {
      const errors = this.linters.filter((linter) => linter.hasErrors());
      const warns = this.linters.filter((linter) => linter.hasWarnings());

      if (errors.find((linter) => linter.isFailOnError() && linter.isFailEarly()) ||
            warns.find((linter) => linter.isFailOnWarning() && linter.isFailEarly())) {
        handler.exit(errors, warns);
      } else {
        handler.finish(errors, warns);
      }
    })
    .catch((error) => handler.error(error));
  }
}

module.exports = FlosRunner;
