
process.env.NODE_ENV = 'test';

module.exports = function (wallaby) {
  return {
    name: 'Flos',
    files: [
      'src/**/*.js',
      'test/fixtures/**/{*,.*}',
    ],

    tests: [
      'test/**/*.test.js',
    ],

    env: {
      type: 'node'
    },

    compilers: {
      '**/*.js': wallaby.compilers.babel(),
    },

    testFramework: 'ava',

    debug: false,

    delays: {
      run: 1000
    }
  };
};
