import test from 'ava';
import sinon from 'sinon';
import FlosLinter from '../lib/linter';
import FlosRunner from '../lib/runner';

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

function mockProcessor() {
  return {
    process: sinon.spy(),
    finish: sinon.spy(),
    exit: sinon.spy(),
    error: sinon.spy(),
  };
}

function run(...linters) {
  const runner = new FlosRunner(...linters);
  const processor = mockProcessor();
  return runner.run(processor).then(() => processor);
}

test('Can be instantiated with linters as arguments', (t) => {
  const linterA = new FlosLinter('a');
  const linterB = new FlosLinter('b');
  const runner = new FlosRunner(linterA, linterB);
  t.is(runner.linters.length, 2);
  t.is(runner.linters[0], linterA);
  t.is(runner.linters[1], linterB);
});

test('Can be instantiated with an array of linters as the single argument', (t) => {
  const linterA = new FlosLinter('a');
  const linterB = new FlosLinter('b');
  const linters = [linterA, linterB];
  const runner = new FlosRunner(linters);
  t.is(runner.linters.length, 2);
  t.is(runner.linters[0], linterA);
  t.is(runner.linters[1], linterB);
});

test('Can configure linters with global options', (t) => {
  const linter = new FlosLinter('a');
  linter.configure = sinon.spy();
  const runner = new FlosRunner(linter);
  const globalOpts = {};
  runner.configure(globalOpts);
  t.true(linter.configure.calledOnce);
  t.true(linter.configure.calledWith(globalOpts));
});

test('Runs linters without errors or warnings', (t) => {
  const linterA = new FlosLinter('a');
  const linterB = new FlosLinter('b');
  linterA.lint = sinon.spy();
  linterB.lint = sinon.spy();
  return run(linterA, linterB).then((processor) => {
    t.true(linterA.lint.calledOnce);
    t.true(linterB.lint.calledOnce);
    t.true(processor.process.calledOnce);
    t.true(processor.process.calledWith([linterA, linterB]));
  }).catch(() => t.fail());
});

test('Runs linters with errors and warnings', (t) => {
  const linterA = new ErrorLinter('a');
  const linterB = new FlosLinter('b');
  const linterC = new WarningLinter('c');
  linterA.lint = sinon.spy();
  linterB.lint = sinon.spy();
  linterC.lint = sinon.spy();
  return run(linterA, linterB, linterC).then((processor) => {
    t.true(linterA.lint.calledOnce);
    t.true(linterB.lint.calledOnce);
    t.true(linterC.lint.calledOnce);
    t.true(processor.process.calledOnce);
    t.true(processor.process.calledWith([linterA, linterB, linterC]));
  });
});

test('Errors on exception', (t) => {
  const linterA = new FlosLinter('a');
  const error = new Error('error a');
  linterA.lint = () => {
    throw error;
  };
  return run(linterA).then((processor) => {
    t.true(processor.error.calledOnce);
    t.true(processor.error.calledWith(error));
  });
});

test('Errors on rejection', (t) => {
  const linterA = new FlosLinter('a');
  const error = new Error('error a');
  linterA.lint = () => Promise.reject(error);
  return run(linterA).then((processor) => {
    t.true(processor.error.calledOnce);
    t.true(processor.error.calledWith(error));
  });
});

test('Returns error when caught', (t) => {
  const linterA = new FlosLinter('a');
  const error = new Error('error a');
  linterA.lint = () => Promise.reject(error);
  const runner = new FlosRunner(linterA);

  const processor = mockProcessor();
  return runner.run(processor).then((err) => {
    t.is(err, error);
  });
});

test('Returns falsy when OK', (t) => {
  const linterA = new FlosLinter('a');
  const runner = new FlosRunner(linterA);

  const processor = mockProcessor();
  return runner.run(processor).then((err) => t.falsy(err));
});