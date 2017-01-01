import test from 'ava';
import sinon from 'sinon';
import {run, Reporter} from '../src/api';

test('run function', t => {
  const linters = [];
  const config = {};
  const reporter = new Reporter();
  // hide default 'finished' output from test output
  sinon.stub(reporter, 'print');
  run(linters, config, reporter);
  t.pass();
});
