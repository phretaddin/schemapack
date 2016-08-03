'use strict';

var Benchmark = require('benchmark');

var sp, msgpack, protobuf, lzstring;

sp = require('./schemapack');
msgpack = require("msgpack-lite"); // Comment out if you didn't `npm install msgpack-lite`
protobuf = require("protobufjs"); // Comment out if you didn't `npm install protobufjs`
lzstring = require('lz-string'); // Comment out if you didn't `npm install lz-string`

function byteCount(testName, len, baseLen) {
  console.log(testName + " Byte Count: " + len + (baseLen ? ', ' + Math.round(len / baseLen * 100) + '%' : ''));
}

function runSuite(suite) {
  suite.on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    var fastest = this.filter('fastest');
    console.log('Fastest is ' + fastest.map('name'));
    var fhz = fastest.map('hz');
    Array.prototype.forEach.call(this, function(item) {
      console.log(item['name'] + ' : ' + Math.round(fhz / item['hz'] * 100) + '% slower');
    });
  })
  .run({ 'async': false, 'minTime': .01, 'minSamples': 0 });
}

exports.runBenchmark = function(schema, val) {
  console.log('###############################');
  console.log("Benchmark beginning..");

  var built = sp.build(schema);
  if (protobuf) {
    var pbJS = protobuf.loadJson(pbjsPlayerSchema);
    var pbMsg = pbJS.build("Message");
  }

  var playerFixture = require('./fixtures/player');

  var suiteEncode = new Benchmark.Suite;
  suiteEncode.add('JSON Encode', function() { JSON.stringify(val); });
  suiteEncode.add('SchemaPack Encode', function() { built.encode(val); });
  if (msgpack) suiteEncode.add('MsgPack Encode', function() { msgpack.encode(val); });
  if (protobuf) suiteEncode.add('ProtoBuf Encode', function() { pbMsg.encode(playerFixture.items[0]).toArrayBuffer(); });
  if (lzstring) suiteEncode.add('LZ-String Encode', function() { lzstring.compressToBase64(JSON.stringify(val)); });
  runSuite(suiteEncode);

  console.log("--------------------------------------");

  var spEncoded = built.encode(val);
  var jsonEncoded = JSON.stringify(val);
  if (msgpack) { var msgPackEncoded = msgpack.encode(val); }
  if (protobuf) { var protobufEncoded = pbMsg.encode(playerFixture.items[0]).toArrayBuffer(); }
  if (lzstring) { var lzstringEncoded = lzstring.compressToBase64(JSON.stringify(val)); }

  var suiteDecode = new Benchmark.Suite;
  suiteDecode.add('JSON Decode', function() { JSON.parse(jsonEncoded); });
  suiteDecode.add('SchemaPack Decode', function() { built.decode(spEncoded); });
  if (msgpack) suiteDecode.add('MsgPack Decode', function() { msgpack.decode(msgPackEncoded); });
  if (protobuf) suiteDecode.add('ProtoBuf Decode', function() { pbMsg.decode(protobufEncoded); });
  if (lzstring) suiteDecode.add('LZ-String Decode', function() { JSON.parse(lzstring.decompressFromBase64(lzstringEncoded)); });
  runSuite(suiteDecode);

  console.log("--------------------------------------");

  byteCount("JSON", jsonEncoded.length);
  byteCount("SchemaPack", spEncoded.length, jsonEncoded.length);
  if (msgpack) { byteCount("MsgPack", msgPackEncoded.length, jsonEncoded.length); }
  if (protobuf) { byteCount("ProtoBuf", protobufEncoded.byteLength, jsonEncoded.length); }
  if (lzstring) { byteCount("LZ-String", lzstringEncoded.length, jsonEncoded.length); }
}

// Used pbjs CLI to create this from .proto file for the player schema
var pbjsPlayerSchema = {
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
