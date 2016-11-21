import test from 'ava';
import sinon from 'sinon';
import FlosLinter from '../lib/linters/flos.linter';
import FlosRunner from '../lib/runners/flos.runner';

class TestLinter extends FlosLinter {

  lint() {
    const promise = new Promise((resolve, reject) => {
      if (this.options.resolve) {
        if (this.options.resolveWarnings && this.options.resolveWarnings.length) {
          this.warnings = this.options.resolveWarnings;
        }
        if (this.options.resolveErrors && this.options.resolveErrors.length) {
          this.errors = this.options.resolveErrors;
        }
        resolve(this);
      } else {
        reject(new Error(this.name + ': ' + this.options.rejectReason));
      }
    });
    return promise;
  }
}

class NOOPHandler {
  finish() {}
  exit() {}
  error() {}
}

test('Runner should configure linters with global options', (t) => {
  const linter = new TestLinter('a');
  linter.configure = sinon.spy();
  const runner = new FlosRunner(linter);
  const globalOpts = {};
  runner.configure(globalOpts);
  t.true(linter.configure.calledOnce);
  t.true(linter.configure.calledWith(globalOpts));
});

test('Runner should execute linters', (t) => {
  const linter = new TestLinter('a');
  linter.lint = sinon.spy();
  const runner = new FlosRunner(linter);
  runner.configure();
  return runner.run(new NOOPHandler).then(() => {
    t.true(linter.lint.calledOnce);
  });
});


