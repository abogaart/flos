import test from 'ava';
import DefaultIgnoreFilter from '../../src/filters/default.ignore.filter';

test('Ignores node_modules folder by default', (t) => {
  const filter = new DefaultIgnoreFilter();
  t.false(filter.apply('./path/to/file.js'));
  t.true(filter.apply('./node_modules/path/to/file.js'));
});

test('Ignores bower_components folder by default', (t) => {
  const filter = new DefaultIgnoreFilter();
  t.false(filter.apply('./path/to/file.js'));
  t.true(filter.apply('./bower_components/path/to/file.js'));
});

