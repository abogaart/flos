import test from 'ava';

// require all transpiled .js files to make sure the code-coverage also includes files wihout tests
// Note: this is a workaround for me not getting the nyc setting "all" to work. Remove once that is fixed.
require('require-all')(__dirname + '/../src');

// make ava happy
test.todo('all test files required');
