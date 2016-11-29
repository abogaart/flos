import FlosProcessor from './processors/flos.processor';
import FlosLinter from './linters/flos.linter';
import FlosReporter from './reporters/flos.reporter';
import FlosRunner from './runners/flos.runner';

module.exports.Processor = FlosProcessor;
module.exports.Linter = FlosLinter;
module.exports.Reporter = FlosReporter;
module.exports.Runner = FlosRunner;
