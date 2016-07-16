var tests = require('./tests');
var schemapack = require('./schemapack');

tests.runTestSuite();
tests.runBenchmark(tests.playerSchema, tests.player);

var msg = schemapack.build(tests.arrSchemaSix);
var buffer = msg.encode(tests.arrSix);
console.log(buffer);
var obj = msg.decode(buffer);
console.log(obj);