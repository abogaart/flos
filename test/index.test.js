import path from 'path';
import test from 'ava';

// require all transpiled .js files to make sure the code-coverage also includes files wihout tests
// Note: this is a workaround for me not getting the nyc setting "all" to work. Remove once that is fixed.
require('require-all')(path.join(__dirname, '/../src'));

// make ava happy
// eslint-disable-next-line  ava/no-todo-test
test.todo('all test files required');
