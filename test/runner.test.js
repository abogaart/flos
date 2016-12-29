import test from 'ava';
import sinon from 'sinon';
import FlosLinter from '../src/linter';
import FlosRunner from '../src/runner';

function mockProcessor() {
  return {
    process: sinon.spy(),
    finish: sinon.spy(),
    exit: sinon.spy(),
    error: sinon.spy()
  };
}

function mockReporter() {
  return {
    error: sinon.spy(),
    warning: sinon.spy(),
    fatal: sinon.spy(),
    exception: sinon.spy(),
    finish: sinon.spy()
  };
}

function run(...linters) {
  const runner = new FlosRunner(...linters);
  const processor = mockProcessor();
  const reporter = mockReporter();
  return runner.run(processor, reporter).then(() => {
    return {processor, reporter};
  });
}

test('Can be instantiated with linters as arguments', t => {
  const linterA = new FlosLinter('a');
  const linterB = new FlosLinter('b');
  const runner = new FlosRunner(linterA, linterB);
  t.is(runner.linters.length, 2);
  t.is(runner.linters[0], linterA);
  t.is(runner.linters[1], linterB);
});

test('Can be instantiated with an array of linters as the single argument', t => {
  const linterA = new FlosLinter('a');
  const linterB = new FlosLinter('b');
  const linters = [linterA, linterB];
  const runner = new FlosRunner(linters);
  t.is(runner.linters.length, 2);
  t.is(runner.linters[0], linterA);
  t.is(runner.linters[1], linterB);
});

test('Can configure linters with global options', t => {
  const linter = new FlosLinter('a');
  linter.configure = sinon.spy();
  const runner = new FlosRunner(linter);
  const globalOpts = {};
  runner.configure(globalOpts);
  t.true(linter.configure.calledOnce);
  t.true(linter.configure.calledWith(globalOpts));
});

test('Runs linters without errors or warnings', async t => {
  const linterA = new FlosLinter('a');
  const linterB = new FlosLinter('b');
  linterA.lint = sinon.spy();
  linterB.lint = sinon.spy();

  const r = await run(linterA, linterB);
  t.true(linterA.lint.calledOnce);
  t.true(linterB.lint.calledOnce);
  t.true(r.processor.process.calledOnce);
  t.true(r.processor.process.calledWith([linterA, linterB]));
});

test('Runs linters with errors and warnings', async t => {
  const linterA = new FlosLinter('a');
  const linterB = new FlosLinter('b');
  const linterC = new FlosLinter('c');
  linterA.lint = sinon.spy();
  linterB.lint = sinon.spy();
  linterC.lint = sinon.spy();
  linterA.errors = ['error1'];
  linterB.warnings = ['warning1'];

  const r = await run(linterA, linterB, linterC);
  t.true(linterA.lint.calledOnce);
  t.true(linterB.lint.calledOnce);
  t.true(linterC.lint.calledOnce);
  t.true(r.processor.process.calledOnce);
  t.true(r.processor.process.calledWith([linterA, linterB, linterC]));
});

test('Reports an exception when lint throws an error', async t => {
  const linterA = new FlosLinter('a');
  const error = new Error('error a');
  linterA.lint = () => {
    throw error;
  };

  const r = await run(linterA);
  t.true(r.reporter.exception.calledOnce);
  t.true(r.reporter.exception.calledWith(error));
});

test('Reports an exception when lint is rejected', async t => {
  const linterA = new FlosLinter('a');
  const error = new Error('error a');
  linterA.lint = () => Promise.reject(error);

  const r = await run(linterA);
  t.true(r.reporter.exception.calledOnce);
  t.true(r.reporter.exception.calledWith(error));
});

test('Returns error when caught', async t => {
  const linterA = new FlosLinter('a');
  const error = new Error('error a');
  linterA.lint = () => Promise.reject(error);

  const runner = new FlosRunner(linterA);
  const err = await runner.run(mockProcessor(), mockReporter());
  t.is(err, error);
});

test('Returns falsy when OK', async t => {
  const linterA = new FlosLinter('a');
  const runner = new FlosRunner(linterA);
  const err = await runner.run(mockProcessor(), mockReporter());
  t.falsy(err);
});
