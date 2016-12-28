import test from 'ava';

import IgnoreFilter from '../../src/filters/ignore.filter';

test('Ignores dot-files by default', t => {
  const filter = new IgnoreFilter();
  const filtered = filter.apply('.flosrc');
  t.true(filtered);
});




