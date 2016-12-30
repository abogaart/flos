import test from 'ava';
import {run} from '../src/api';

test('run function', t => {
  const linters = [];
  const config = {};
  run(linters, config);
  t.pass();
});
