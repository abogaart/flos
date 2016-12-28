import test from 'ava';
import sinon from 'sinon';
import FlosProcessor from '../src/processor';
import FlosLinter from '../src/linter';

let processor;
let reporter;

test.beforeEach(() => {
  reporter = {
    error: sinon.spy(),
    warning: sinon.spy(),
    fatal: sinon.spy(),
    exception: sinon.spy(),
    finish: sinon.spy(),
  };
  processor = new FlosProcessor();
});

test('Finishes without warning and errors', t => {
  const linterA = new FlosLinter('a');
  const linterB = new FlosLinter('b');
  processor.process([linterA, linterB], reporter);
  t.true(reporter.finish.calledOnce);
});

test('Finishes with errors and warnings', t => {
  const linterA = new FlosLinter('a');
  linterA.errors = ['error1', 'error2'];
  const linterB = new FlosLinter('b');
  linterB.errors = ['error3'];
  const linterC = new FlosLinter('c');
  linterC.warnings = ['warning1'];
  const linterD = new FlosLinter('d');
  processor.process([linterA, linterB, linterC, linterD], reporter);
  t.is(reporter.error.callCount, 2);
  t.is(reporter.warning.callCount, 1);
  t.true(reporter.finish.calledOnce);
});

test('Detects fatal linters', t => {
  const linterA = new FlosLinter('a', { failEarly: true, failOnError: true });
  linterA.errors = ['error1'];
  processor.process([linterA], reporter);
  t.true(reporter.fatal.calledOnce);
  t.true(reporter.fatal.calledWith([linterA], []));

  reporter.fatal.reset();
  const linterB = new FlosLinter('b', { failEarly: true, failOnWarning: true });
  linterB.warnings = ['warning1'];
  processor.process([linterB], reporter);
  t.true(reporter.fatal.calledOnce);
  t.true(reporter.fatal.calledWith([], [linterB]));
});
