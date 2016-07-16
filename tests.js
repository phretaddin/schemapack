'use strict';

var schemapack = require('./schemapack');
var msgpack = require("msgpack-lite");
// var fs = require("fs"),
// var path = require("path"),
// var ProtoBuf = require("protobufjs");

// var protoBuilder = ProtoBuf.loadProtoFile(path.join(__dirname, "example.proto")),
// var protoMessage = protoBuilder.build("Message"); 

exports.objSchemaOne = {
  damage: "int8",
  alive: "boolean",
  x: "int8",
  y: "int8",
  coords: [ ["int16"], "int8" ],
  name: "string",
  data: {
    apple: 'int8',
    banana: 'int8'
  }
};

exports.objOne = {
  damage: 5,
  alive: false,
  x: 23,
  y: 44,
  coords: [ [6], 7 ],
  name: 'david',
  data: {
    apple: 3,
    banana: 7
  }
};

exports.playerSchema = {
  health: "uint16",
  level: "uint8",
  jumping: "boolean",
  position: [ "varuint" ],
  name: "string",
  stats: { str: 'uint8', agi: 'uint8', int: 'uint8' }
};

exports.player = {
  health: 4000,
  level: 50,
  jumping: false,
  position: [ 20, 400, 300 ],
  name: "John",
  stats: { str: 87, agi: 42, int: 22 }
};

exports.arrSchemaOne = [
  "int32",
  "boolean",
  "int8",
  "int8",
  [ "int16", "int8", "int8", "int8" ]
];

exports.arrOne = [
  5,
  false,
  23,
  44,
  [ 6, 7, 8, 9 ]
];

exports.arrSchemaTwo = [
  [ "int8" ],
  "float32",
  "int16",
  "string",
  "int16",
  [ [ "int8" ], "string", "int32" ],
  "uint32"
];

exports.arrTwo = [
  [ 22, 44, 55 ], 
  22.6767,
  55,
  "asdдasf",
  12123,
  [ [ 22, 33, 44 ], "HI", 2000000 ],
  3333
];

exports.arrSchemaThree = [
  [ "int16", "int8" ],
  [ "int8", "string" ],
  "int16",
  "bool"
];

exports.arrThree = [
  [ 22, 33, 44 ],
  [ 22, "hello", "world" ],
  5000,
  true
];

exports.arrSchemaFour = [
  "int8",
  "int16",
  "int8"
];

exports.arrFour = [
  10,
  20,
  30
];

exports.arrSchemaFive = [
  "int8",
  "varint",
  "int8",
  {
    'test': "int8",
    'asdf': "int16"
  }
];

exports.arrFive = [
  10,
  20,
  -5,
  {
    'test': 3,
    'asdf': 23
  }
];

exports.arrSchemaSix = {
   position: [ ["varuint"], "int16" ],
}

exports.arrSix = {
  position: [ [20], 400, 300 ], // 10
};

function bothEqual(obj1, obj2) {
  for (var prop in obj1) {
    if (obj1.hasOwnProperty(prop)) {
    	var item1 = obj1[prop];
      var item2 = obj2[prop];

      if (item1 == undefined || item1 == null) { return false; }
      if (item2 == undefined || item2 == null) { return false; }
      
      if (typeof item1 == "object") {
        bothEqual(item1, item2);
      } else {
        if (typeof item1 === "number") { item1 = item1.toFixed(5); } // for floating point
        if (typeof item2 === "number") { item2 = item2.toFixed(5); } // for floating point
        if (item1 !== item2) { return false; }
      }
    }
  }
  return true;
}

function runTest(val, expected) {
  console.log("Given Value:    " + JSON.stringify(val));
  console.log("Expected Value: " + JSON.stringify(expected));

  var eq = bothEqual(val, expected) && bothEqual(expected, val);

  if (eq) { console.log('\x1b[32mTest Passed\x1b[0m'); } 
  else { console.log('\x1b[31mTest Failed\x1b[0m'); }
  
  console.log('-------------------');

  return eq;
}

exports.testValues = function(schema, val) {
  var built = schemapack.build(schema);

  return runTest(built.decode(built.encode(val)), val);
}

exports.runTestObj = function() {
  exports.testValues(exports.objSchemaOne, exports.objOne);
}

exports.runTestSuite = function() {
  var testSuite = [];

  testSuite.push(exports.testValues(exports.objSchemaOne, exports.objOne));
  testSuite.push(exports.testValues(exports.playerSchema, exports.player));
  
  testSuite.push(exports.testValues(exports.arrSchemaOne, exports.arrOne));
  testSuite.push(exports.testValues(exports.arrSchemaTwo, exports.arrTwo));
  testSuite.push(exports.testValues(exports.arrSchemaThree, exports.arrThree));
  testSuite.push(exports.testValues(exports.arrSchemaFour, exports.arrFour));
  testSuite.push(exports.testValues(exports.arrSchemaFive, exports.arrFive));
  testSuite.push(exports.testValues(exports.arrSchemaSix, exports.arrSix));
  
  if (testSuite.every(e => e === true)) { console.log("\x1b[32mAll Tests Passed!\x1b[0m"); } 
  else { console.log("\x1b[31mTest Suite Failure!\x1b[0m"); }
}

exports.benchmark = function(testName, fn) {
  console.time(testName);
	for (var i = 0; i < 100000; i++) { fn(); }
  console.timeEnd(testName);
}

exports.runBenchmark = function(schema, val) {
  console.log("Benchmark beginning..");

  var built = schemapack.build(schema);

  exports.benchmark('Mine Encode', function() { built.encode(val); });
  exports.benchmark('JSON Encode', function() { JSON.stringify(val); });
  exports.benchmark('MsgPack Encode', function() { msgpack.encode(val); });

  console.log("--------------------------------------");

  var mineEncoded = built.encode(val);
  var jsonEncoded = JSON.stringify(val);
  var msgPackEncoded = msgpack.encode(val);

  exports.benchmark('Mine Decode', function() { built.decode(mineEncoded); });
  exports.benchmark('JSON Decode', function() { JSON.parse(jsonEncoded); });
  exports.benchmark('MsgPack Decode', function() { msgpack.decode(msgPackEncoded); })
}