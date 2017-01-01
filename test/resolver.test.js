/* eslint-disable import/default */

import test from 'ava';
import sinon from 'sinon';

import Resolver from '../src/resolver';
import Filter from '../src/filters/filter';
import fixtures from './fixtures/index';

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
    cwd: fixture()
  }, opts));
}

function getFiles(opts) {
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
test('Returns zero files if no config is set', async t => {
  const files = await new Resolver().getFiles();
  t.deepEqual(files, []);
});

test('Returns zero files if include pattern not set', async t => {
  const files = await new Resolver({include: false}).getFiles();
  t.deepEqual(files, []);
});

test('Returns files from single include pattern', async t => {
  const files = await getFiles();
  equals(t, files, 'file1.js', 'src/src1.js', 'src/folder1/src2.js');
});

test('Returns files from multiple include patterns', async t => {
  const files = await getFiles({include: ['**/src1.js', '**/src2.js']});
  equals(t, files, 'src/src1.js', 'src/folder1/src2.js');
});

test('Includes node_modules et al when excludeDefault and ignoreDefault are false', async t => {
  const files = await getFiles({
    excludeDefault: false,
    ignoreDefault: false
  });
  contains(t, files, 'bower_components/mod1/mod1.js', 'node_modules/mod1/mod1.js');
});

test('Includes node_modules et al in glob if excludeDefault is false', async t => {
  const files = await resolver({
    excludeDefault: false
  })
  .glob(ALL_JS);

  contains(t, files, 'bower_components/mod1/mod1.js', 'node_modules/mod1/mod1.js');
});

test('Includes dot-files when dotfiles is true', async t => {
  const files = await getFiles({
    dotfiles: true
  });
  contains(t, files, '.dotfile1.js');
});

test('Includes dot-files when pattern is dot-pattern', async t => {
  const files = await getFiles({
    include: '.*'
  });
  contains(t, files, '.dotfile1.js');
});

// default excludes and ignores
test('Excludes node_modules et al by default', async t => {
  const files = await getFiles();
  notContains(t, files, 'bower_components/mod1/mod1.js', 'node_modules/mod1/mod1.js');
});

test('Ignores node_modules and bower_components by default', async t => {
  const files = await getFiles({
    excludeDefault: false
  });
  notContains(t, files, 'bower_components/mod1/mod1.js', 'node_modules/mod1/mod1.js');
});

test('Excludes dot-files by default', async t => {
  const files = await getFiles();
  notContains(t, files, '.dotfile1.js');
});

// exclude
test('Excludes patterns from glob', async t => {
  const files = await resolver({
    exclude: ['src/**']
  })
  .glob(ALL_JS);
  equals(t, files, 'file1.js');
});

// ignore
test('Ignore pattern can be specified', async t => {
  const files = await getFiles({
    ignorePatterns: ['folder1/']
  });
  equals(t, files, 'file1.js', 'src/src1.js');
});

test('Multiple ignore patterns can be specified', async t => {
  const files = await getFiles({
    ignorePatterns: ['folder1/', 'src1.*']
  });
  equals(t, files, 'file1.js');
});

test('Ignore can be disabled', async t => {
  const files = await getFiles({
    ignorePattern: ['file1.js'],
    ignore: false
  });
  contains(t, files, 'file1.js');
});

// filters
test('Executes custom filters', async t => {
  const filter = new Filter();
  const stub = sinon.stub(filter, 'apply').returns(true);
  const files = await getFiles({
    filters: [filter]
  });

  t.deepEqual(files, []);
  t.true(stub.calledThrice);
  t.true(stub.calledWith('file1.js'));
  t.true(stub.calledWith('src/src1.js'));
  t.true(stub.calledWith('src/folder1/src2.js'));
});
