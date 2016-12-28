import IgnoreFilter from './ignore.filter';

/**
 * Adds `"*"` at the end of `"node_modules/"`,
 * so that subtle directories could be re-included by .gitignore patterns
 * such as `"!node_modules/should_not_ignored"`
 */
const DEFAULT_IGNORE_DIRS = [
  '/node_modules/*',
  '/bower_components/*'
];

class DefaultIgnoreFilter extends IgnoreFilter {

  constructor(options) {
    super(Object.assign({}, options, {
      ignorePatterns: DEFAULT_IGNORE_DIRS,
      reportFiltered: false
    }));
  }

}

export default DefaultIgnoreFilter;
