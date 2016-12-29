import path from 'path';
import test from 'ava';
import sinon from 'sinon';
import Filter from '../../src/filters/filter';

const cwd = process.cwd();
const root = path.resolve('/');
const base = path.resolve('/base');

const relPathToFile = 'path/to/file.js';
const absPathToFile = path.resolve('/path/to/file.js');

// basedir configuration
test('process.cwd() is the default baseDir', t => {
  const filter = new Filter();
  t.is(filter.getBaseDir(), process.cwd());
});

test('has a configurable basedir', t => {
  const baseDir = path.join(cwd, 'testcwd');
  const filter = new Filter({cwd: baseDir});
  t.is(filter.getBaseDir(), baseDir);
});

test('resolves a basedir with a relative path to an abslute path, relative to process.cwd()', t => {
  const relativePath = new Filter({cwd: 'testcwd'});
  t.is(relativePath.getBaseDir(), path.join(cwd, 'testcwd'));
});

// default behavior
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

// filter calling
test('calls filter with an absolute path, and a path relative to the baseDir', t => {
  const filter = new Filter({cwd: base});
  const spy = sinon.spy(filter, 'filter');

  filter.apply('file.js');
  t.true(spy.calledOnce);
  t.true(spy.calledWithExactly(path.join(base, 'file.js'), 'file.js'));
  spy.reset();

  filter.apply('path/to/file.js');
  t.true(spy.calledOnce);
  t.true(spy.calledWithExactly(path.join(base, relPathToFile), relPathToFile));
  spy.reset();

  // outside of baseDir
  filter.apply('/file.js');
  t.true(spy.calledWithExactly('/file.js', '../file.js'));
  spy.reset();

  filter.apply('/path/to/file.js');
  t.true(spy.calledOnce);
  t.true(spy.calledWithExactly(absPathToFile, '../path/to/file.js'));
  spy.reset();
});

// file tracking
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
