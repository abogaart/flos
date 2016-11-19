import test from 'ava';
import FlosLinter from '../lib/linters/flos.linter';

class TestLinter extends FlosLinter {

  lint() {
    const promise = new Promise((resolve, reject) => {
      if (this.options.resolve) {
        if (this.options.resolveWarnings && this.options.resolveWarnings.length) {
          this.warnings = this.options.resolveWarnings;
        }
        if (this.options.resolveErrors && this.options.resolveErrors.length) {
          this.errors = this.options.resolveErrors;
        }
        resolve(this);
      } else {
        reject(new Error(this.name + ': ' + this.options.rejectReason));
      }
    });
    return promise;
  }
}

test('Linter has a name', (t) => {
  const linter = new TestLinter('test-name');
  t.is(linter.getName(), 'test-name');
});

test('Linter options can be extended by global options', (t) => {
  const linter = new TestLinter('test-name', { a: 'a' });
  linter.configure({ b: 'b' });
  t.deepEqual(linter.options, { a: 'a', b: 'b' });
});

test('Linter options are not overriden by global options', (t) => {
  const linter = new TestLinter('test-name', { a: 'a' });
  linter.configure({ a: 'b' });
  t.deepEqual(linter.options, { a: 'a'});
});

