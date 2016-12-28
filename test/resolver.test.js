import test from 'ava';
import sinon from 'sinon';

import fixtures from './fixtures/index';
import Resolver from '../src/resolver';
import Filter from '../src/filters/filter';

const ALL_JS = '**/*.js';

let fixture;
test.before(() => {
  fixture = fixtures.fixture('resolver');
});

test.after.always(() => {
  fixtures.cleanup('resolver');
});

function resolver(opts) {
  return new Resolver(Object.assign({}, {
    include: [ALL_JS],
    cwd: fixture(),
  }, opts));
}

function files(opts) {
  return resolver(opts).getFiles();
}

function contains(t, value, ...expected) {
  expected.forEach(expect => t.true(value.includes(expect), 'checking if value contains ' + expect));
}

function notContains(t, value, ...expected) {
  expected.forEach(expect => t.false(value.includes(expect), 'checking if value contains ' + expect));
}

function equals(t, value, ...expected) {
  contains(t, value, ...expected);
  t.is(value.length, expected.length);
}

// include
test('Returns zero files if no config is set', t => {
  return new Resolver()
  .getFiles()
  .then(files => t.deepEqual(files, []));
});

test('Returns zero files if include pattern not set', t => {
  return new Resolver({ include: false })
  .getFiles()
  .then(files => t.deepEqual(files, []));
});

test('Returns files from single include pattern', t => {
  return files()
  .then(files => equals(t, files, 'file1.js', 'src/src1.js', 'src/folder1/src2.js'));
});

test('Returns files from multiple include patterns', t => {
  return files({ include: ['**/src1.js', '**/src2.js']})
  .then(files => equals(t, files, 'src/src1.js', 'src/folder1/src2.js'));
});

test('Includes node_modules and bower_components when excludeDefault and ignoreDefault are false', t => {
  return files({
    excludeDefault: false,
    ignoreDefault: false,
  })
  .then(files => contains(t, files, 'bower_components/mod1/mod1.js', 'node_modules/mod1/mod1.js'));
});

test('Includes node_modules and bower_components in glob if excludeDefault is false', t => {
  return resolver({
    excludeDefault: false,
  })
  .glob(ALL_JS)
  .then(files => contains(t, files, 'bower_components/mod1/mod1.js', 'node_modules/mod1/mod1.js'));
});

test('Includes dot-files when dotFiles is true', t => {
  return files({
    dotFiles: true,
  })
  .then(files => contains(t, files, '.dotfile1.js'));
});

test('Includes dot-files when pattern is dot-pattern', t => {
  return files({
    include: '.*'
  })
  .then(files => contains(t, files, '.dotfile1.js'));
});

// default excludes and ignores
test('Excludes node_modules and bower_components by default', t => {
  return files()
  .then(files => notContains(t, files, 'bower_components/mod1/mod1.js', 'node_modules/mod1/mod1.js'));
});

test('Ignores node_modules and bower_components by default', t => {
  return files({
    excludeDefault: false
  })
  .then(files => notContains(t, files, 'bower_components/mod1/mod1.js', 'node_modules/mod1/mod1.js'));
});

test('Excludes dot-files by default', t => {
  return files()
  .then(files => notContains(t, files, '.dotfile1.js'));
});

// exclude
test('Excludes patterns from glob', t => {
  return resolver({
    exclude: ['src/**'],
  })
  .glob(ALL_JS)
  .then(files => equals(t, files, 'file1.js'));
});

// ignore
test('Ignore pattern can be specified', t => {
  return files({
    ignorePatterns: ['folder1/']
  })
  .then(files => equals(t, files, 'file1.js', 'src/src1.js'));
});

test('Multiple ignore patterns can be specified', t => {
  return files({
    ignorePatterns: ['folder1/', 'src1.*']
  })
  .then(files => equals(t, files, 'file1.js'));
});

test('Ignore can be disabled', t => {
  return files({
    ignorePattern: ['file1.js'],
    ignore: false
  })
  .then(files => contains(t, files, 'file1.js'));
});

// filters
test('Executes custom filters', t => {
  const filter = new Filter();
  const stub = sinon.stub(filter, 'apply').returns(true);
  return files({
    filters: [filter]
  })
  .then(files => {
    t.deepEqual(files, []);
    t.true(stub.calledThrice);
    t.true(stub.calledWith('file1.js'));
    t.true(stub.calledWith('src/src1.js'));
    t.true(stub.calledWith('src/folder1/src2.js'));
  });
});
