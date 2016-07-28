'use strict';

var schemapack, msgpack, protobuf;

schemapack = require('./schemapack');
// msgpack = require("msgpack-lite"); // Uncomment if you `npm install msgpack-lite` to include in the benchmark
// protobuf = require("protobufjs"); // Uncomment if you `npm install protobufjs` to include in the benchmark

exports.largeObjectSchema = {
  damage: "int8",
  alive: "boolean",
  x: "int8",
  y: "int8",
  coords: [ "uint8" ],
  name: "string",
  data: {
    apple: 'int8',
    banana: 'int8'
  },
  bigArray: [ "uint8" ]
};

exports.largeObject = {
  damage: 5,
  alive: false,
  x: 23,
  y: 44,
  coords: [ 7 ],
  name: 'david',
  data: {
    apple: 3,
    banana: 7
  },
  bigArray: [ 87,97,24,10,23,45,66,74,72,60,3,31,6,65,15,44,23,5,52,40,10,97,53,66,41,80,75,25,6,56,12,26,99,40,68,12,27,52,77,93,17,85,73,65,42,21,43,94,24,6,7,86,43,27,52,34,52,94,81,87,49,2,79,20,55,71,9,27,95,32,21,54,87,72,41,32,74,60,40,62,47,79,28,58,10,28,42,69,6,65,72,70,53,60,60,18,70,91,62,75,72,59,64,1,76,96,99,69,9,56,22,99,25,78,1,38,24,95,20,79,59,41,65,79,43,18,87,77,58,14,93,35,67,76,77,14,67,50,69,95,52,45,70,9,35,40,91,93,75,96,7,23,55,54,32,84,54,21,97,34,35,99,49,93,23,11,1,49,61,14,16,13,64,76,29,1,82,54,73,78,92,2,6,99,46,93,1,73,28,52,59,18,24,17,35,34,71,98,7,73,9,66,67,18,88,63,79,83,9,67,55,36,47,42,55,77,3,73,47,96,73,41,43,42,30,81,35,43,7,41,54,70,50,85,33,53,22,3,77,49,16,24,88,25,85,81,62,31,45,91,10,24,18,68,55,78,70,21,83,20,26,56,32,13,36,6,84,27,94,27,82,61,37,71,91,63,24,20,60,10,49,80,61,42,42,86,29,71,63,6,93,60,64,14,40,70,57,78,39,71,45,51,38,50,58,17,47,56,44,73,29,88,65,8,28,23,19,95,99,52,86,34,19,23,96,49,91,16,62,16,90,81,3,87,61,39,29,83,13,77,26,42,37,17,61,81,33,76,69,20,50,39,95,85,25,72,71,36,27,16,89,69,44,4,8,65,47,70,35,33,82,66,99,14,83,97,52,7,88,26,97,60,31,95,33,40,3,42,64,47,73,80,76,38,94,17,14,80,3,74,36,83,15,60,65,41,18,92,75,91,3,94,85,55,67,97,38,11,94,12,94,44,19,69,45,38,77,40,61,91,65,15,96,39,39,4,22,69,7,95,80,59,41,47,3,21,83,63,89,12,77,93,67,59,68,52,56,64,62,61,29,58,11,6,58,33,48,31,12,74,77,65,98,10,60,25,46,65,68,50,94,26,82,31,67,31,87,2,99,35,77,59,85,27,59,65,36,66,42,83,26,8,18,55,52,43,10,49,27,9,70,77,26,71,3,59,48,15,64,15,33,58,91,35,15,92,81,87,72,8,68,70,92,16,78,79,92,97,69,4,47,68,52,48,94,47,53,14,74,99,51,78,52,42,90,45,16,37,12,75,2,16,24,10,60,56,22,15,65,14,11,83,15,35,6,19,78,63,11,59,98,2,86,46,17,38,45,59,81,81,49,2,72,54,75,24,64,34,2,83,26,23,99,31,38,83,38,30,44,58,12,30,72,14,49,96,68,32,4,10,73,5,92,91,60,3,66,32,5,55,21,33,53,5,19,8,87,15,10,31,33,24,53,78,6,44,33,4,54,60,25,96,26,32,32,64,39,68,6,42,21,60,57,81,2,91,31,77,85,46,77,36,2,38,1,10,63,3,30,71,70,47,88,45,39,84,48,10,52,43,68,25,95,48,37,58,88,84,97,14,86,98,94,64,29,52,93,60,67,92,57,27,44,10,70,42,67,67,93,62,50,29,83,16,29,98,42,99,79,36,48,88,57,78,53,2,45,60,78,72,10,74,41,36,82,98,4,13,93,44,85,70,95,23,72,30,96,9,99,33,67,89,39,1,93,82,55,42,76,26,21,33,44,48,53,84,12,19,77,80,7,64,81,84,21,93,18,54,2,29,77,43,46,79,40,26,79,79,56,16,77,69,6,24,45,30,45,41,90,87,62,91,40,46,21,91,72,90,44,66,72,26,73,83,50,25,29,23,14,55,12,28,28,19,50,27,9,91,68,38,68,32,7,52,19,64,29,94,92,64,11,41,83,53,82,24,26,36,15,38,83,78,28,74,5,9,71,62,52,64,54,32,14,76,60,36,89,65,33,79,80,16,74,94,6,84,71,73,7,65,93,16,20,68,89,29,48,64,8,36,58,90,84,33,54,92,73,83,27,68,98,44,51,86,84,65,24,68,74,67,70,56,52,28,96,92,73,68,77,85,1,63,24,25,85,85,75,65,92,53,43,50,20,46,12,83,30,88,55,54,24,34,48,9,57,91,34,66,34,27,10,80,57,35,24,85,12,32,76,8,2,11,36,87,1,84,28,76,5,26,59,56,34,14,36,60,15,46,20,44,7,49,42,42,32,96,52,27,45,56 ]
};

exports.playerSchema = {
  health: "varuint",
  jumping: "boolean",
  position: [ "int16" ],
  attributes: { str: 'uint8', agi: 'uint8', int: 'uint8' }
};

exports.player = {
  health: 4000,
  jumping: false,
  position: [ -540, 343, 1201 ],
  attributes: { str: 87, agi: 42, int: 22 }
};

exports.complexArraySchema = [
  "float32",
  "boolean",
  "int8",
  "int16",
  [ "bool", [ "int8", ["varint"], "varuint" ], "string" ],
  { 
    points: [ "varuint" ],
    name: "string"
  },
  "uint32",
  {
    otherDataTypes: {
      a: "uint8",
      b: "float64",
      c: "int16",
      d: "uint16",
      e: "int32"
    }
  },
  ["uint16", "int8"],
  "int8"
];

exports.complexArray = [
  1225.2347,
  false,
  23,
  5555,
  [ true, [7, [-866, 4453, 5234234, 4543434, 4544666], 1, 100, 10000 ], "hi" ],
  { 
    points: [ 3434, 546, 1212, 66 ],
    name: "lilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilIlilI"
  },
  500000000,
  {
    otherDataTypes: {
      a: 55,
      b: -53845.43242342342,
      c: -5300, 
      d: 15000,
      e: 2000000
    }
  },
  [ 22, 5, 5, 5 ],
  1,
  2,
  3
];

exports.singleVarSchema = "string";
exports.singleVar = "hello, how are you?";

exports.singleConsSchema = "bool";
exports.singleCons = true;

function bothEqual(obj1, obj2) {
  for (var prop in obj1) {
    if (obj1.hasOwnProperty(prop)) {
    	var item1 = obj1[prop];
      var item2 = obj2[prop];

      if (item1 == undefined || item1 == null) { return false; }
      if (item2 == undefined || item2 == null) { return false; }
      
      if (typeof item1 == "object") {
        if (!bothEqual(item1, item2)) { return false; }
      } else {
        if (typeof item1 === "number" || typeof item2 === "number") {
          if (Math.abs(item1 - item2) > .01) { return false; } // Floating point epsilon
        } else if (item1 !== item2) { return false; }
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

exports.runTestSuite = function() {
  var testSuite = [];

  testSuite.push(exports.testValues(exports.largeObjectSchema, exports.largeObject));
  testSuite.push(exports.testValues(exports.playerSchema, exports.player));
  testSuite.push(exports.testValues(exports.complexArraySchema, exports.complexArray));
  testSuite.push(exports.testValues(exports.singleVarSchema, exports.singleVar));
  testSuite.push(exports.testValues(exports.singleConsSchema, exports.singleCons));
  
  if (testSuite.every(e => e === true)) { console.log("\x1b[32mAll Tests Passed!\x1b[0m"); } 
  else { console.log("\x1b[31mTest Suite Failure!\x1b[0m"); }
}

exports.benchmark = function(testName, fn) {
  console.time(testName);
  for (var i = 0; i < 100000; i++) { fn(); }
  console.timeEnd(testName);
};

exports.runBenchmark = function(schema, val) {
  console.log("Benchmark beginning..");

  var built = schemapack.build(schema);
  if (protobuf) { var pbJS = protobuf.loadJson(playerSchemaPB); }
  if (protobuf) { var pbMsg = pbJS.build("Message"); }

  exports.benchmark('SchemaPack Encode', function() { built.encode(val); });
  exports.benchmark('JSON Encode', function() { JSON.stringify(val); });
  if (msgpack) { exports.benchmark('MsgPack Encode', function() { msgpack.encode(val); }); }
  if (protobuf) { exports.benchmark('ProtoBuf Encode Player', function() { pbMsg.encode(exports.player).toArrayBuffer(); }); }

  console.log("--------------------------------------");

  var schemapackEncoded = built.encode(val);
  var jsonEncoded = JSON.stringify(val);
  if (msgpack) { var msgPackEncoded = msgpack.encode(val); }
  if (protobuf) { var protobufEncoded = pbMsg.encode(exports.player).toArrayBuffer(); }

  exports.benchmark('SchemaPack Decode', function() { built.decode(schemapackEncoded); });
  exports.benchmark('JSON Decode', function() { JSON.parse(jsonEncoded); });
  if (msgpack) { exports.benchmark('MsgPack Decode', function() { msgpack.decode(msgPackEncoded); }); }
  if (protobuf) { exports.benchmark('ProtoBuf Decode Player', function() { pbMsg.decode(protobufEncoded); }); }

  console.log("--------------------------------------");

  console.log("SchemaPack Byte Count: " + schemapackEncoded.byteLength);
  console.log("JSON Byte Count: " + jsonEncoded.length);
  if (msgpack) { console.log("MsgPack Byte Count: " + msgPackEncoded.length); }
  if (protobuf) { console.log("ProtoBuf Byte Count: " + protobufEncoded.byteLength); }
};

// Used pbjs CLI to create this from .proto file for the player schema
var playerSchemaPB = {
  "package": null,
  "messages": [{
    "name": "Message",
    "fields": [{
      "rule": "required",
      "type": "int32",
      "name": "health",
      "id": 1
    }, {
      "rule": "required",
      "type": "bool",
      "name": "jumping",
      "id": 2
    }, {
      "rule": "repeated",
      "type": "int32",
      "name": "position",
      "id": 3
    }, {
      "rule": "required",
      "type": "Attributes",
      "name": "attributes",
      "id": 4
    }],
    "messages": [{
      "name": "Attributes",
      "fields": [{
        "rule": "required",
        "type": "int32",
        "name": "str",
        "id": 1
      }, {
        "rule": "required",
        "type": "int32",
        "name": "agi",
        "id": 2
      }, {
        "rule": "required",
        "type": "int32",
        "name": "int",
        "id": 3
      }]
    }]
  }]
};
