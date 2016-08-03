var benchmarks = require('./benchmarks');
// var sp = require('./schemapack');

var fixPlayer = require('./fixtures/player');

benchmarks.runBenchmark(fixPlayer.schema, fixPlayer.items[0]);

// Use npm test to run test suite
