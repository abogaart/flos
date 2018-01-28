import path from 'path';
import pathUtil from 'path-util';
import test from 'ava';
import sinon from 'sinon';
import Filter from '../../src/filters/filter';

const cwd = pathUtil.canonicalize(process.cwd());
const root = path.resolve('/');
const base = path.resolve('/root/base');

const relFile = 'file.js';
const absFile = pathUtil.toAbsolute(relFile, root);
const relPathToFile = 'path/to/file.js';
const absPathToFile = pathUtil.toAbsolute(relPathToFile, root);

// Basedir configuration
test('process.cwd() is the default baseDir', t => {
  const filter = new Filter();
  t.is(filter.getBaseDir(), cwd);
});

test('has a configurable basedir', t => {
  const baseDir = pathUtil.toAbsolute('testcwd', cwd);
  const filter = new Filter({cwd: baseDir});
  t.is(filter.getBaseDir(), baseDir);
});

test('resolves a basedir with a relative path to an abslute path, relative to process.cwd()', t => {
  const relativePath = new Filter({cwd: 'testcwd'});
  t.is(relativePath.getBaseDir(), pathUtil.toAbsolute('testcwd', cwd));
});

// Default behavior
test('ignores files by default', t => {
  const filter = new Filter();
  t.false(filter.apply(relPathToFile));
});

test('throws exception when apply is called with an empty path', t => {
  const filter = new Filter();
  const customError = 'Expected filePath argument of type string';

  t.throws(() => filter.apply(), customError);
  t.throws(() => filter.apply(''), customError);
  t.throws(() => filter.apply('   '), customError);
  t.throws(() => filter.apply('\n'), customError);
  t.throws(() => filter.apply(null), customError);
  t.throws(() => filter.apply(undefined), customError);
  t.throws(() => filter.apply(false), customError);
});

// Filter calling
test('calls filter with an absolute path, and a path relative to the baseDir', t => {
  const filter = new Filter({cwd: base});
  const spy = sinon.spy(filter, 'filter');

  filter.apply('file.js');
  t.true(spy.calledOnce);
  t.true(spy.calledWithExactly(pathUtil.toAbsolute('file.js', base), 'file.js'));
  spy.resetHistory();

  filter.apply('path/to/file.js');
  t.true(spy.calledOnce);
  t.true(spy.calledWithExactly(pathUtil.toAbsolute(relPathToFile, base), relPathToFile));
  spy.resetHistory();

  filter.apply('/root/base/path/to/file.js');
  t.true(spy.calledOnce);
  t.true(spy.calledWithExactly(pathUtil.toAbsolute(relPathToFile, base), relPathToFile));
});

test('handles baseDir == root correctly', t => {
  const filter = new Filter({cwd: root});
  const spy = sinon.spy(filter, 'filter');

  filter.apply('file.js');
  t.true(spy.calledWithExactly(absFile, relFile));
  spy.resetHistory();

  filter.apply('/file.js');
  t.true(spy.calledWithExactly(absFile, relFile));
  spy.resetHistory();

  filter.apply('path/to/file.js');
  t.true(spy.calledWithExactly(absPathToFile, relPathToFile));
  spy.resetHistory();

  filter.apply('/path/to/file.js');
  t.true(spy.calledWithExactly(absPathToFile, relPathToFile));
  spy.resetHistory();
});

test('handles path outside of baseDir correctly', t => {
  const filter = new Filter({cwd: base});
  const spy = sinon.spy(filter, 'filter');

  filter.apply('/file.js');
  t.true(spy.calledOnce);
  t.true(spy.calledWithExactly(absFile, '../../file.js'));
  spy.resetHistory();

  filter.apply('/path/to/file.js');
  t.true(spy.calledOnce);
  t.true(spy.calledWithExactly(absPathToFile, '../../path/to/file.js'));
  spy.resetHistory();
});

// File tracking
test('tracks filtered files by default', t => {
  const filter = new Filter({cwd: root});
  sinon.stub(filter, 'filter').returns(true);

  filter.apply(relPathToFile);
  t.true(filter.tracking(absPathToFile));
});

test('tracks only filtered files', t => {
  const filter = new Filter({cwd: root});
  sinon.stub(filter, 'filter')
    .withArgs(absPathToFile, relPathToFile)
    .returns(true);

  filter.apply(relPathToFile);
  filter.apply('path/to/files2.js');

  t.true(filter.tracking(absPathToFile));
  t.false(filter.tracking(path.resolve('/path/to/files2.js')));
});

test('does not track filtered files when options.trackFiltered is false', t => {
  const filter = new Filter({cwd: root, trackFiltered: false});
  sinon.stub(filter, 'filter').returns(true);

  filter.apply(relPathToFile);
  t.false(filter.tracking(absPathToFile));

  filter.apply('path/to/files2.js');
  t.false(filter.tracking(absPathToFile));
});
