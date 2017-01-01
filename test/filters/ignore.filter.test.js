import test from 'ava';

import IgnoreFilter from '../../src/filters/ignore.filter';

test('allows all files except dotfiles by default', t => {
  const filter = new IgnoreFilter();
  t.true(filter.apply('.flosrc'));
  t.false(filter.apply('file.js'));
  t.false(filter.apply('/path/to/file.js'));
});

test('allows dot-files by configuration', t => {
  const filter = new IgnoreFilter({dotfiles: true});
  t.false(filter.apply('.flosrc'));
});

test('ignores files by pattern', t => {
  const filter = new IgnoreFilter({
    ignorePatterns: '*.js'
  });

  t.true(filter.apply('file.js'));
  t.true(filter.apply('/path/file.js'));
  t.false(filter.apply('file.css'));
  t.false(filter.apply('/path/file.css'));
});

test('ignores files by patterns', t => {
  const filter = new IgnoreFilter({
    ignorePatterns: ['*.js', '*.css']
  });

  t.true(filter.apply('file.js'));
  t.true(filter.apply('file.css'));
  t.true(filter.apply('/path/file.js'));
  t.true(filter.apply('/path/file.css'));
});

test('pattern can be added', t => {
  const filter = new IgnoreFilter();
  filter.addPattern('*.js');

  t.true(filter.apply('file.js'));
  t.true(filter.apply('/path/file.js'));
  t.false(filter.apply('file.css'));
  t.false(filter.apply('/path/file.css'));
});

test('patterns can be added', t => {
  const filter = new IgnoreFilter();
  filter.addPattern(['*.js', '*.css']);

  t.true(filter.apply('file.js'));
  t.true(filter.apply('file.css'));
  t.true(filter.apply('/path/file.js'));
  t.true(filter.apply('/path/file.css'));
});
