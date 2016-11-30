import FlosProcessor from './processors/flos.processor';
import FlosLinter from './linters/flos.linter';
import FlosReporter from './reporters/flos.reporter';
import FlosRunner from './runners/flos.runner';

export const Linter = FlosLinter;
export const Processor = FlosProcessor;
export const Reporter = FlosReporter;
export const Runner = FlosRunner;
