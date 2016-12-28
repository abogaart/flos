import test from 'ava';

import fixtures from '../fixtures/index';
import IgnoreFileFilter from '../../src/filters/ignore.file.filter';

let fixture;

test.before(() => {
  fixture = fixtures.fixture('ignore-file-filter');
});

test('sets baseDir to cwd when no ignore file was found', t => {
  const filter = new IgnoreFileFilter({
    cwd: fixture("no-ignore-file")
  });

  t.is(filter.getBaseDir(), fixture("no-ignore-file"));
});

test.after.always(() => {
  fixtures.cleanup('ignore-file-filter');
});
