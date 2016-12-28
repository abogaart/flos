
import FlosReporter from './reporter';

class FlosProcessor {

  process(linters, reporter = new FlosReporter()) {
    const errors = linters.filter(linter => linter.hasErrors());
    const warnings = linters.filter(linter => linter.hasWarnings());

    errors.forEach(linter => reporter.error(linter));
    warnings.forEach(linter => reporter.warning(linter));

    if (this.isFatal(errors, warnings)) {
      reporter.fatal(errors, warnings);
    } else {
      reporter.finish();
    }
  }

  isFatal(errors, warnings) {
    return errors.find(linter => linter.isFailOnError() && linter.isFailEarly()) ||
          warnings.find(linter => linter.isFailOnWarning() && linter.isFailEarly());
  }
}

export default FlosProcessor;
