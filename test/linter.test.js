import test from 'ava';
import sinon from 'sinon';

import FlosLinter from '../src/linter';

test('Has a name', (t) => {
  const linter = new FlosLinter('test-name');
  t.is(linter.getName(), 'test-name');
});

test('Options can be extended by global options', (t) => {
  const linter = new FlosLinter('test-name', { a: 'a' });
  linter.configure({ b: 'b' });
  t.deepEqual(linter.options, { a: 'a', b: 'b', include: [], exclude: [] });
});

test('Options are not overriden by global options', (t) => {
  const linter = new FlosLinter('test-name', { a: 'a' });
  linter.configure({ a: 'b' });
  t.deepEqual(linter.options, { a: 'a', include: [], exclude: []});
});

test('Has default options', (t) => {
  const linter = new FlosLinter('test-name');
  t.false(linter.isPrintEarly());
  t.false(linter.isFailEarly());
  t.false(linter.isFailOnError());
  t.false(linter.isFailOnWarning());
});

test('Options are set and immutable', (t) => {
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

test('Has errors and warnings', (t) => {
  const linter = new FlosLinter('test-name');
  t.false(linter.hasErrors());
  t.false(linter.hasWarnings());

  linter.errors.push({});
  linter.warnings.push({});
  t.true(linter.hasErrors());
  t.true(linter.hasWarnings());
});

test('Should resolve a promise with a reference to itself on a succesful lint operation', (t) => {
  const linter = new FlosLinter('test-name');
  return linter.lint().then((result) => t.is(result, linter));
});

test('Create a new resolver when starting a lint operation', t => {
  const linter = new FlosLinter('test-name');
  const spy = sinon.spy(linter, 'createResolver');
  return linter.lint().then(() => t.true(spy.calledOnce));
});

test('Reuses resolver if it already exists', t => {
  const linter = new FlosLinter('test-name');
  const spy = sinon.spy(linter, 'createResolver');
  return linter.lint().then(() => {
    return linter.lint().then(() => t.true(spy.calledOnce));
  });
});

