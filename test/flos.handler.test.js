import test from 'ava';
import sinon from 'sinon';
import FlosHandler from '../lib/handlers/flos.handler';
import FlosLinter from '../lib/linters/flos.linter';

test('Has a default reporter', (t) => {
  handler = new FlosHandler();
  t.truthy(handler.reporter);
});

let handler;
let reporter;

test.beforeEach(() => {
  reporter = {
    error: sinon.spy(),
    warning: sinon.spy(),
    fatal: sinon.spy(),
    exception: sinon.spy(),
    finish: sinon.spy(),
  };
  handler = new FlosHandler(reporter);
});

test('Will report all errors and warnings on finish', (t) => {
  handler.finish([ 'error1' , 'error 2' ], [ 'warning 1', 'warning 2', 'warning 3' ]);
  t.is(reporter.error.callCount, 2);
  t.is(reporter.warning.callCount, 3);
});

test('Will report all errors and warnings on exit', (t) => {
  handler.exit([ 'error1' , 'error 2', 'error 3'], [ 'warning 1' ]);
  t.is(reporter.error.callCount, 3);
  t.is(reporter.warning.callCount, 1);
  t.true(reporter.fatal.calledOnce);
});

test('Will report an error', (t) => {
  const error = new Error('error 1');
  handler.error(error);
  t.true(reporter.exception.calledOnce);
});

test('Exits on fatal errors and failEarly', (t) => {
  const linterA = new FlosLinter('a', { failEarly: true, failOnError: true });
  linterA.errors = ['error1'];
  const linterB = new FlosLinter('b');
  handler.exit = sinon.spy();
  handler.ok([linterA, linterB]);
  t.true(handler.exit.calledOnce);
  t.true(handler.exit.calledWith([linterA], []));
});

test('Exits on fatal warnings and failEarly', (t) => {
  const linterA = new FlosLinter('a', { failEarly: true, failOnWarning: true });
  linterA.warnings = ['warning1'];
  const linterB = new FlosLinter('b');
  handler.exit = sinon.spy();
  handler.ok([linterA, linterB]);
  t.true(handler.exit.calledOnce);
  t.true(handler.exit.calledWith([], [ linterA ]));
});

test('Finishes on OK', (t) => {
  const linterA = new FlosLinter('a');
  const linterB = new FlosLinter('b');
  handler.finish = sinon.spy();
  handler.ok([linterA, linterB]);
  t.true(handler.finish.calledOnce);
  t.true(handler.finish.calledWith([], []));
});
