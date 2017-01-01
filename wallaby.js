
process.env.NODE_ENV = 'test';

module.exports = function (wallaby) {
  return {
    name: 'Flos',
    files: [
      'src/**/*.js',
      'test/fixtures/index.js',
      {
        pattern: 'test/fixtures/**/{*,.*}',
        instrument: false
      }
    ],

    tests: [
      'test/**/*.test.js'
    ],

    env: {
      type: 'node'
    },

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },

    testFramework: 'ava',

    debug: true,

    delays: {
      run: 1000
    }
  };
};
