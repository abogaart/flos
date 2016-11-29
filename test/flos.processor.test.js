import test from 'ava';
import sinon from 'sinon';
import FlosProcessor from '../lib/processors/flos.processor';
import FlosLinter from '../lib/linters/flos.linter';

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
  processor = new FlosProcessor(reporter);
});

test('Has a default reporter', (t) => {
  processor = new FlosProcessor();
  t.truthy(processor.reporter);
});

test('Will report all errors and warnings on finish', (t) => {
  processor.finish([ 'error1' , 'error 2' ], [ 'warning 1', 'warning 2', 'warning 3' ]);
  t.is(reporter.error.callCount, 2);
  t.is(reporter.warning.callCount, 3);
});

test('Will report all errors and warnings on exit', (t) => {
  processor.exit([ 'error1' , 'error 2', 'error 3'], [ 'warning 1' ]);
  t.is(reporter.error.callCount, 3);
  t.is(reporter.warning.callCount, 1);
  t.true(reporter.fatal.calledOnce);
});

test('Will report an error', (t) => {
  const error = new Error('error 1');
  processor.error(error);
  t.true(reporter.exception.calledOnce);
});

test('Exits on fatal errors and failEarly', (t) => {
  const linterA = new FlosLinter('a', { failEarly: true, failOnError: true });
  linterA.errors = ['error1'];
  const linterB = new FlosLinter('b');
  processor.exit = sinon.spy();
  processor.process([linterA, linterB]);
  t.true(processor.exit.calledOnce);
  t.true(processor.exit.calledWith([linterA], []));
});

test('Exits on fatal warnings and failEarly', (t) => {
  const linterA = new FlosLinter('a', { failEarly: true, failOnWarning: true });
  linterA.warnings = ['warning1'];
  const linterB = new FlosLinter('b');
  processor.exit = sinon.spy();
  processor.process([linterA, linterB]);
  t.true(processor.exit.calledOnce);
  t.true(processor.exit.calledWith([], [ linterA ]));
});

test('Finishes without warning and errors', (t) => {
  const linterA = new FlosLinter('a');
  const linterB = new FlosLinter('b');
  processor.finish = sinon.spy();
  processor.process([linterA, linterB]);
  t.true(processor.finish.calledOnce);
  t.true(processor.finish.calledWith([], []));
});
