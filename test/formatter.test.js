import test from 'ava';
import FlosLinter from '../lib/linter';
import FlosFormatter from '../lib/formatter';

let formatter;

test.beforeEach(() => {
  formatter = new FlosFormatter();
});

test('Formats errors', (t) => {
  const linterA = new FlosLinter('a');
  linterA.errors = [ 'err1', 'err2' ];
  const errMsg = formatter.formatErrors(linterA);
  t.is(errMsg, 'Errors from a\nerr1\nerr2');
});

test('Formats warnings', (t) => {
  const linterB = new FlosLinter('b');
  linterB.warnings = [ 'warn1', 'warn2' ];
  const warnMsg = formatter.formatWarnings(linterB);
  t.is(warnMsg, 'Warnings from b\nwarn1\nwarn2');
});

test('Formats fatals', (t) => {
  const err1 = new FlosLinter('e1');
  err1.errors = [ 'err1' ];
  const err2 = new FlosLinter('e2');
  err2.errors = [ 'err2', 'err3' ];
  const err3 = new FlosLinter('e3');
  err3.errors = [ 'err4' ];

  const warn1 = new FlosLinter('w1');
  warn1.warnings = [ 'warn1' ];
  const warn2 = new FlosLinter('w2');
  warn2.warnings = [ 'warn2', 'warn3' ];
  const warn3 = new FlosLinter('w3');
  warn3.warnings = [ 'warn4' ];

  let fatalMsg = formatter.formatFatals([], []);
  t.is(fatalMsg, 'Linting failed');

  fatalMsg = formatter.formatFatals([err1], []);
  t.is(fatalMsg, 'Linting failed: found 1 error in linter e1');

  fatalMsg = formatter.formatFatals([err1, err2], []);
  t.is(fatalMsg, 'Linting failed: found 3 errors in linters e1 and e2');

  fatalMsg = formatter.formatFatals([err1, err2, err3], []);
  t.is(fatalMsg, 'Linting failed: found 4 errors in linters e1, e2 and e3');

  fatalMsg = formatter.formatFatals([], [warn1]);
  t.is(fatalMsg, 'Linting failed: found 1 warning in linter w1');

  fatalMsg = formatter.formatFatals([], [warn1, warn2]);
  t.is(fatalMsg, 'Linting failed: found 3 warnings in linters w1 and w2');

  fatalMsg = formatter.formatFatals([], [warn1, warn2, warn3]);
  t.is(fatalMsg, 'Linting failed: found 4 warnings in linters w1, w2 and w3');

  fatalMsg = formatter.formatFatals([err1], [warn1]);
  t.is(fatalMsg, 'Linting failed: found 1 error in linter e1, and 1 warning in linter w1');

  fatalMsg = formatter.formatFatals([err1, err2], [warn1, warn2]);
  t.is(fatalMsg, 'Linting failed: found 3 errors in linters e1 and e2, and 3 warnings in linters w1 and w2');

  fatalMsg = formatter.formatFatals([err1, err2, err3], [warn1, warn2, warn3]);
  t.is(fatalMsg, 'Linting failed: found 4 errors in linters e1, e2 and e3, ' +
    'and 4 warnings in linters w1, w2 and w3');
});

test('Formats exception', (t) => {
  const linterA = new FlosLinter('a');
  linterA.errors = [ 'err1', 'err2' ];
  const linterB = new FlosLinter('b');
  linterB.warnings = [ 'warn1' ];

  const error1 = 'error1';
  const error2 = { stack: 'error2'};
  t.is(formatter.formatException(error1), 'error1');
  t.is(formatter.formatException(error2), 'error2');
});


