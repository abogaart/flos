import test from 'ava';
import util from '../src/util';

test('function asArray returns empty array if arguments is empty', t => {
  t.deepEqual(util.asArray(), []);
});

test('function asArray converts string to array with a single string', t => {
  t.deepEqual(util.asArray('test'), ['test']);
});

test('function asArray returns array if argument is array', t => {
  const test = ['t1', 't2'];
  t.is(util.asArray(test), test);
});
