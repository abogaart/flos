import test from 'ava';
import sinon from 'sinon';
import Filter from '../../src/filters/filter';

// basedir configuration
test('process.cwd() is the default baseDir', t => {
  const filter = new Filter();
  t.is(filter.getBaseDir(), process.cwd());
});

test('the value of baseDir is configurable', t => {
  const filter = new Filter({cwd: 'testcwd'});
  t.is(filter.getBaseDir(), 'testcwd');
});

// default behavior
test('ignores files by default', t => {
  const filter = new Filter();
  t.false(filter.apply('path/to/file.js'));
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
  const filter = new Filter({ cwd: '/' });
  const spy = sinon.spy(filter, 'filter');

  filter.apply('file.js');
  t.true(spy.calledOnce);
  t.true(spy.calledWithExactly('/file.js', 'file.js'));
  spy.reset();

  filter.apply('path/to/file.js');
  t.true(spy.calledOnce);
  t.true(spy.calledWithExactly('/path/to/file.js', 'path/to/file.js'));
  spy.reset();

  filter.apply('/path/to/file.js');
  t.true(spy.calledOnce);
  t.true(spy.calledWithExactly('/path/to/file.js', 'path/to/file.js'));
  spy.reset();
});

test('handles baseDir correctly when calling filter', t => {
  const filter = new Filter({ cwd: '/root' });
  const spy = sinon.spy(filter, 'filter');

  filter.apply('file.js');
  t.true(spy.calledWithExactly('/root/file.js', 'file.js'));
  spy.reset();

  filter.apply('/root/file.js');
  t.true(spy.calledWithExactly('/root/file.js', 'file.js'));
  spy.reset();

  filter.apply('path/file.js');
  t.true(spy.calledWithExactly('/root/path/file.js', 'path/file.js'));
  spy.reset();

  filter.apply('/root/path/file.js');
  t.true(spy.calledWithExactly('/root/path/file.js', 'path/file.js'));
  spy.reset();

  // outside of baseDir
  filter.apply('/file.js');
  t.true(spy.calledWithExactly('/file.js', '../file.js'));
  spy.reset();
});

// file tracking
test('tracks filtered files by default', t => {
  const filter = new Filter({ cwd: '/' });
  sinon.stub(filter, 'filter').returns(true);

  filter.apply('path/to/files.js');
  t.true(filter.tracking('/path/to/files.js'));
});

test('tracks only filtered files', t => {
  const filter = new Filter({ cwd: '/' });
  sinon.stub(filter, 'filter')
    .withArgs('/path/to/files.js', 'path/to/files.js')
    .returns(true);

  filter.apply('path/to/files.js');
  filter.apply('path/to/files2.js');

  t.true(filter.tracking('/path/to/files.js'));
  t.false(filter.tracking('/path/to/files2.js'));
});

test('does not track filtered files when options.trackFiltered is false', t => {
  const filter = new Filter({ cwd: '/', trackFiltered: false });
  sinon.stub(filter, 'filter').returns(true);

  filter.apply('path/to/files.js');
  t.false(filter.tracking('/path/to/files.js'));

  filter.apply('path/to/files2.js');
  t.false(filter.tracking('/path/to/files2.js'));
});
