var tests = require('./tests');
// var schemapack = require('./schemapack');

tests.runTestSuite();
tests.runBenchmark(tests.playerSchema, tests.player);
