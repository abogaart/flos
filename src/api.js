import FlosProcessor from './processor';
import FlosLinter from './linter';
import FlosReporter from './reporter';
import FlosRunner from './runner';

export const Linter = FlosLinter;
export const Processor = FlosProcessor;
export const Reporter = FlosReporter;
export const Runner = FlosRunner;

export function run(linters, config, reporter = new Reporter(), processor = new Processor()) {
  const runner = new FlosRunner(linters);
  runner.configure(config);
  runner.run(processor, reporter);
}
