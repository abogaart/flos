import test from 'ava';
import {asArray} from '../src/util';

test('function asArray returns empty array if arguments is empty', t => {
  t.deepEqual(asArray(), []);
});

test('function asArray converts string to array with a single string', t => {
  t.deepEqual(asArray('test'), ['test']);
});

test('function asArray returns array if argument is array', t => {
  const test = ['t1', 't2'];
  t.is(asArray(test), test);
});
