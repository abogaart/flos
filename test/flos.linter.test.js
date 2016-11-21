import test from 'ava';
import FlosLinter from '../lib/linters/flos.linter';

test('Linter has a name', (t) => {
  const linter = new FlosLinter('test-name');
  t.is(linter.getName(), 'test-name');
});

test('Linter options can be extended by global options', (t) => {
  const linter = new FlosLinter('test-name', { a: 'a' });
  linter.configure({ b: 'b' });
  t.deepEqual(linter.options, { a: 'a', b: 'b' });
});

test('Linter options are not overriden by global options', (t) => {
  const linter = new FlosLinter('test-name', { a: 'a' });
  linter.configure({ a: 'b' });
  t.deepEqual(linter.options, { a: 'a'});
});

test('Linter options are set and immutable', (t) => {
  const opts = {
    failEarly: true,
    printEarly: true,
    failOnError: true,
    failOnWarning: true
  };
  const linter = new FlosLinter('test-name', opts);
  t.true(linter.isPrintEarly());
  t.true(linter.isFailEarly());
  t.true(linter.isFailOnError());
  t.true(linter.isFailOnWarning());

  opts.printEarly = false;
  t.true(linter.isPrintEarly());
});

test('Linter has errors and warnings', (t) => {
  const linter = new FlosLinter('test-name');
  t.false(linter.hasErrors());
  t.false(linter.hasWarnings());

  linter.errors.push({});
  linter.warnings.push({});
  t.true(linter.hasErrors());
  t.true(linter.hasWarnings());
});

test('Linter should resolve a promise with a reference to itself on a succesful lint operation', (t) => {
  const linter = new FlosLinter('test-name');
  return linter.lint().then((result) => t.is(result, linter));
});

