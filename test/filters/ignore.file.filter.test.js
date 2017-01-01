/* eslint-disable import/default */
import test from 'ava';

import fixtures from '../fixtures/index';
import IgnoreFileFilter from '../../src/filters/ignore.file.filter';

test.after.always(() => {
  fixtures.cleanup('ignore-file-filter');
});

test('finds the ignorefile by filename if configured', t => {
  const fixture = fixtures.fixture('ignore-file-filter');
  const filter = new IgnoreFileFilter({
    cwd: fixture(),
    ignoreFilename: '.flosignore'
  });
  t.true(filter.apply('file.js'));
  t.false(filter.apply('file.css'));
  t.is(filter.getIgnorePath(), fixture('.flosignore'));
});

test('can be configured with an absolute path to the ignore file', t => {
  const fixture = fixtures.fixture('ignore-file-filter');
  const filter = new IgnoreFileFilter({
    ignorePath: fixture('.flosignore')
  });
  t.true(filter.apply('file.js'));
  t.false(filter.apply('file.css'));
  t.is(filter.getIgnorePath(), fixture('.flosignore'));
});

test('throws an error when option ignorePath is set and file not found', t => {
  const fixture = fixtures.fixture('ignore-file-filter');
  const ignorePath = fixture('.noflosignore');
  const error = t.throws(() => new IgnoreFileFilter({ignorePath}));
  t.true(error.message.startsWith('Cannot read ignore file: ' + ignorePath));
});

test('returns false when file referenced by option ignoreFilename is not found', t => {
  const ignoreFilename = '.noflosignore';
  const filter = new IgnoreFileFilter({ignoreFilename});
  t.false(filter.getIgnorePath());
});
