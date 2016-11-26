import test from 'ava';
import sinon from 'sinon';
import FlosLinter from '../lib/linters/flos.linter';
import FlosReporter from '../lib/reporters/flos.reporter';

let formatter;
let reporter;

test.beforeEach(() => {
  formatter = {};
  formatter.formatErrors = sinon.spy();
  formatter.formatError = sinon.spy();
  formatter.formatWarnings = sinon.spy();
  formatter.formatWarning = sinon.spy();
  formatter.formatFatals = sinon.spy();
  formatter.formatException = sinon.spy();
  reporter = new FlosReporter(formatter);
  reporter.print = sinon.spy();
});

test('Prints errors and warnings early', (t) => {
  const linter = new FlosLinter('a', { printEarly: true });
  linter.errors = [ 'a', 'b' ];
  reporter.error(linter);
  t.is(reporter.print.callCount, 1);
  t.is(formatter.formatErrors.callCount, 1);

  linter.warnings = [ 'c', 'd' ];
  reporter.warning(linter);
  t.is(reporter.print.callCount, 2);
  t.is(formatter.formatWarnings.callCount, 1);
});

test('Stores errors and warnings if not early', (t) => {
  const linter = new FlosLinter('a');
  linter.errors = [ 'a', 'b' ];
  linter.warnings = [ 'c' ];
  reporter.error(linter);
  reporter.warning(linter);
  t.is(reporter.errors.length, 2);
  t.is(formatter.formatError.callCount, 2);
  t.is(reporter.warnings.length, 1);
  t.is(formatter.formatWarning.callCount, 1);

  linter.errors = [ 'c' ];
  reporter.error(linter);
  t.is(reporter.errors.length, 3);
  t.is(formatter.formatError.callCount, 3);

  t.is(reporter.print.callCount, 0);
});

test('Throws on fatal', (t) => {
  const linter = new FlosLinter('a');
  linter.errors = [ 'a', 'b' ];
  linter.warnings = [ 'c' ];

  t.throws(() => {
    reporter.fatal([ linter ], []);
  }, Error);

  t.true(formatter.formatFatals.calledOnce);
});

test('Prints an exception', (t) => {
  reporter.exception(new Error('error 1'));
  t.true(reporter.print.calledOnce);
  t.true(formatter.formatException.calledOnce);
});
