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

class ErrorLinter extends FlosLinter {
  constructor(name, opts, ...errors) {
    super(name, opts);
    this.errors = errors.length ? errors : [ 'error 1' ];
  }
}

class WarningLinter extends FlosLinter {
  constructor(name, opts, ...warnings) {
    super(name, opts);
    this.warnings = warnings.length ? warnings : [ 'warning 1' ];
  }
}

function run(...linters) {
  const runner = new FlosRunner(...linters);
  const handler = {};
  handler.finish = sinon.spy();
  handler.exit = sinon.spy();
  handler.error = sinon.spy();
  return runner.run(handler).then(() => handler);
}

test('Runner should configure linters with global options', (t) => {
  const linter = new FlosLinter('a');
  linter.configure = sinon.spy();
  const runner = new FlosRunner(linter);
  const globalOpts = {};
  runner.configure(globalOpts);
  t.true(linter.configure.calledOnce);
  t.true(linter.configure.calledWith(globalOpts));
});

test('Runner runs linters and finishes without errors or warnings', (t) => {
  const linterA = new FlosLinter('a');
  const linterB = new FlosLinter('b');
  linterA.lint = sinon.spy();
  linterB.lint = sinon.spy();
  return run(linterA, linterB).then((handler) => {
    t.true(linterA.lint.calledOnce);
    t.true(linterB.lint.calledOnce);
    t.true(handler.finish.calledOnce);
    t.true(handler.finish.calledWith([], []));
  });
});

test('Runner finishes with errors and warnings', (t) => {
  const linterA = new ErrorLinter('a');
  const linterB = new TestLinter('b', { resolve: true });
  const linterC = new WarningLinter('c');
  return run(linterA, linterB, linterC).then((handler) => {
    t.true(handler.finish.calledOnce);
    t.true(handler.finish.calledWith([ linterA ], [linterC]));
  });
});

test('Runner exits on fatal errors and failEarly', (t) => {
  const linterA = new ErrorLinter('a', { failEarly: true, failOnError: true });
  const linterB = new TestLinter('b', { resolve: true });
  return run(linterA, linterB).then((handler) => {
    t.true(handler.exit.calledOnce);
    t.true(handler.exit.calledWith([linterA], []));
  });
});

test('Runner exits on fatal warnings and failEarly', (t) => {
  const linterA = new WarningLinter('a', { failEarly: true, failOnWarning: true });
  const linterB = new TestLinter('b', { resolve: true });
  return run(linterA, linterB).then((handler) => {
    t.true(handler.exit.calledOnce);
    t.true(handler.exit.calledWith([], [ linterA ]));
  });
});

test('Runner errors on exception', (t) => {
  const linterA = new FlosLinter('a');
  const error = new Error('error a');
  linterA.lint = () => {
    throw error;
  };
  return run(linterA).then((handler) => {
    t.true(handler.error.calledOnce);
    t.true(handler.error.calledWith(error));
  });
});

test('Runner errors on rejection', (t) => {
  const linterA = new FlosLinter('a');
  const error = new Error('error a');
  linterA.lint = () => Promise.reject(error);
  return run(linterA).then((handler) => {
    t.true(handler.error.calledOnce);
    t.true(handler.error.calledWith(error));
  });
});

