// MIT License
// Source: https://github.com/phretaddin/schemapack

'use strict';

var byteOffset = 0;
var strEnc = "utf8";

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  var Buffer = require('buffer').Buffer;
}

var addTypeAlias = function(newTypeName, underlyingType) {
  byteCountDict[newTypeName] = byteCountDict[underlyingType];
  readTypeDict[newTypeName] = readTypeDict[underlyingType];
  writeTypeDict[newTypeName] = writeTypeDict[underlyingType];
}

var changeStringEncoding = function(stringEncoding) {
  var requested = stringEncoding.trim().toLowerCase();
  var available = [ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ];
  if (available.indexOf(requested) > -1) { strEnc = requested; }
  else { throw "String encoding not available"; }
}

function getVarUIntByteLength(value) {
  return Math.floor(Math.log(value) / Math.log(128)) + 1;
}

function getVarIntByteLength(value) {
  return getVarUIntByteLength((value << 1) ^ (value >> 31));
}

function writeVarUInt(buffer, value) {
  while (value > 127) {
    buffer[byteOffset++] = (value & 127) | 128;
    value >>= 7;
  }
  buffer[byteOffset++] = value & 127;
}

function writeVarInt(buffer, value) {
  writeVarUInt(buffer, (value << 1) ^ (value >> 31));
}

function readVarUInt(buffer) {
  var val = 0, i = 0, byte;

  do {
    byte = buffer[byteOffset++];
    val |= (byte & 127) << (7 * i);
    i++;
  } while (byte & 128);

  return val;
}

function readVarInt(buffer) {
  var val = readVarUInt(buffer);
  return (val >>> 1) ^ -(val & 1);
}

function getStringByteLength(str) {
  if (strEnc === "ascii") { 
    return str.length; 
  } else {
    var s = str.length;
    
    for (var i = s - 1; i >= 0; i--) {
      var code = str.charCodeAt(i);
      if (code > 0x7f && code <= 0x7ff) { s++; }
      else if (code > 0x7ff && code <= 0xffff) { s += 2; }
      if (code >= 0xDC00 && code <= 0xDFFF) { i--; } // Trail surrogate
    }
    
    return s;
  }
}

function writeString(buffer, val) {
  var len = getStringByteLength(val);

  if (strEnc === "ascii") {
    writeVarUInt(buffer, len);
    for (var i = 0; i < len; i++) { buffer.writeUInt8(val.charCodeAt(i), byteOffset++, true); }
  } else {
    writeVarUInt(buffer, len);
    byteOffset += buffer.write(val, byteOffset, undefined, strEnc);
  }
}

function readString(buffer, strLen) {
  if (strEnc === "ascii") {
    var str = "";
    for (var i = 0; i < strLen; i++) { str += String.fromCharCode(buffer[byteOffset++]); }
    return str;
  } else {
    var str = buffer.slice(byteOffset, byteOffset + strLen).toString(strEnc);
    byteOffset += strLen;
    return str;
  }
}

function peek(arr) { return arr[arr.length - 1]; }

function calculateByteCount(obj, schema) {
  var refStack = [ obj ];
  var byteCount = 0;

  for (var i = 0; i < schema.length; i += 2) {
    var key = schema[i];
    var dataType = schema[i + 1];

    switch (dataType) {
      case "__arrend": {
        var arr = refStack.pop();
        var len = arr.length;
        
        byteCount += getVarUIntByteLength(len);

        var repeatCount = len - key;

        if (repeatCount > 0) {
          var repeatedDataType = schema[i - 1];
          if (repeatedDataType === "varuint" || repeatedDataType === "varint" || repeatedDataType === "string") {
            for (var j = key; j < len; j++) {
              byteCount += byteCountDict[repeatedDataType](arr[j]);
            }
          } else {
            byteCount += (repeatCount * byteCountDict[repeatedDataType]());
          }
        }

        break;
      }
      case "__obj": { refStack.push(peek(refStack)[key]); break; }
      case "__arr": { refStack.push(peek(refStack)[key]); break; }
      case "string":
      case "varuint":
      case "varint": { byteCount += byteCountDict[dataType](peek(refStack)[key]); break; }
      case "__objend": { refStack.pop(); break; }
      default: { byteCount += byteCountDict[dataType](); break; }
    }
  }

  return byteCount;  
}

function encode(json, schema) {
  var buffer = Buffer.allocUnsafe(calculateByteCount(json, schema));
  var refStack = [ json ];
  byteOffset = 0;

  for (var i = 0; i < schema.length; i += 2) {
    var key = schema[i];
    var dataType = schema[i + 1];
    var val = peek(refStack)[key];

    switch (dataType) {
      case "__arrend": {
        var arr = refStack.pop();
        var repeatCount = arr.length - key;

        if (repeatCount > 0) {
          var repeatedDataType = schema[i - 1];
          for (var j = key; j < arr.length; j++) {
            writeTypeDict[repeatedDataType](buffer, arr[j]);
          }
        }

        break;
      }
      case "__arr": { writeVarUInt(buffer, val.length); refStack.push(val); break; }
      case "__obj": { refStack.push(val); break; }
      case "string":
      case "varuint":
      case "varint": { writeTypeDict[dataType](buffer, val); break; }
      case "__objend": { refStack.pop(); break; }
      default: { writeTypeDict[dataType](buffer, val); break; }
    }
  }
  return buffer;
}

function decode(buffer, schema, isArray) {
  var refStack = [ isArray ? [] : {} ];
  var arrayLengthStack = [];
  
  byteOffset = 0;  

  for (var i = 0; i < schema.length; i += 2) {
    var key = schema[i];
    var dataType = schema[i + 1];
    var val = peek(refStack);

    switch (dataType) {
      case "__arrend": {
        var repeatedDataType = schema[i - 1];
        var len = arrayLengthStack.pop();
        for (var j = key; j < len; j++) { readTypeDict[repeatedDataType](buffer, j, val); }
        refStack.pop();
        break;
      }
      case "__arr": {
        var decodedLength = readVarUInt(buffer);

        var arr = [];
        val[key] = arr;
        arrayLengthStack.push(decodedLength);
        refStack.push(arr);
        break;
      }
      case "__obj": { var obj = {}; val[key] = obj; refStack.push(obj); break; }
      case "string":
      case "varuint":
      case "varint": { readTypeDict[dataType](buffer, key, val); break; }
      case "__objend": { refStack.pop(); break; }
      default: { readTypeDict[dataType](buffer, key, val); }
    }
  }

  return peek(refStack);
}

var byteCountDict = {
  "boolean": function() { return 1; },
  "int8": function() { return 1; },
  "uint8": function() { return 1; },
  "int16": function() { return 2; },
  "uint16": function() { return 2; },
  "int32": function() { return 4; },
  "uint32": function() { return 4; },
  "float32": function() { return 4; },
  "float64": function() { return 8; },
  "string": function(val) { var len = getStringByteLength(val); return getVarUIntByteLength(len) + len; },
  "varuint": function(val) { return getVarUIntByteLength(val); },
  "varint": function(val) { return getVarIntByteLength(val); }
};

var readTypeDict = {
  "boolean": function(buffer, key, decObj) { decObj[key] = Boolean(buffer.readUInt8(byteOffset, true)); byteOffset += 1; },
  "int8": function(buffer, key, decObj) { decObj[key] = buffer.readInt8(byteOffset, true); byteOffset += 1; },
  "uint8": function(buffer, key, decObj) { decObj[key] = buffer.readUInt8(byteOffset, true); byteOffset += 1; },
  "int16": function(buffer, key, decObj) { decObj[key] = buffer.readInt16BE(byteOffset, true); byteOffset += 2; },
  "uint16": function(buffer, key, decObj) { decObj[key] = buffer.readUInt16BE(byteOffset, true); byteOffset += 2; },
  "int32": function(buffer, key, decObj) { decObj[key] = buffer.readInt32BE(byteOffset, true); byteOffset += 4; },
  "uint32": function(buffer, key, decObj) { decObj[key] = buffer.readUInt32BE(byteOffset, true); byteOffset += 4; },
  "float32": function(buffer, key, decObj) { decObj[key] = buffer.readFloatBE(byteOffset, true); byteOffset += 4; },
  "float64": function(buffer, key, decObj) { decObj[key] = buffer.readDoubleBE(byteOffset, true); byteOffset += 8; },
  "string": function(buffer, key, decObj) { decObj[key] = readString(buffer, readVarUInt(buffer)); },
  "varuint": function(buffer, key, decObj) { decObj[key] = readVarUInt(buffer); },
  "varint": function(buffer, key, decObj) { decObj[key] = readVarInt(buffer); }
};

var writeTypeDict = {
  "boolean": function(buffer, val) { buffer.writeUInt8(val ? 1 : 0, byteOffset, true); byteOffset += 1; },
  "int8": function(buffer, val) { buffer.writeInt8(val, byteOffset, true); byteOffset += 1; },
  "uint8": function(buffer, val) { buffer.writeUInt8(val, byteOffset, true); byteOffset += 1; },
  "int16": function(buffer, val) { buffer.writeInt16BE(val, byteOffset, true); byteOffset += 2; },
  "uint16": function(buffer, val) { buffer.writeUInt16BE(val, byteOffset, true); byteOffset += 2; },
  "int32": function(buffer, val) { buffer.writeInt32BE(val, byteOffset, true); byteOffset += 4; },
  "uint32": function(buffer, val) { buffer.writeUInt32BE(val, byteOffset, true); byteOffset += 4; },
  "float32": function(buffer, val) { buffer.writeFloatBE(val, byteOffset, true); byteOffset += 4; },
  "float64": function(buffer, val) { buffer.writeDoubleBE(val, byteOffset, true); byteOffset += 8; },
  "string": function(buffer, val) { writeString(buffer, val); },
  "varuint": function(buffer, val) { writeVarUInt(buffer, val); },
  "varint": function(buffer, val) { writeVarInt(buffer, val); }
};

function getFlattened(schema) {
  var allTypes = Object.keys(byteCountDict);

  function flatten(json, acc, inArray) {
    var keys = Object.keys(json);
    keys.sort(function(a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); });

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = json[key];

      if (inArray) { key = +key; }

      if (val.constructor === Array) {
        flattened.push(key, '__arr');
        flatten(val, [key, '__arr'], true);
        flattened.push(val.length, '__arrend');
      } else if (typeof val === 'object') {
        flattened.push(key, '__obj');
        flatten(val, [key, '__obj']);
        flattened.push(key, '__objend');
      } else {
        var dataType = val.trim().toLowerCase();

        if (allTypes.indexOf(dataType) > -1) { flattened.push(key, dataType); }
        else { throw "Invalid data type in schema."; }
      }
    }
  }
  var flattened = [];
  flatten(schema, [], schema.constructor === Array);
  return flattened;
}

function build(schema) { 
  var builtSchema = getFlattened(schema);

  return {
    "encode": function(json) { return encode(json, builtSchema); },
    "decode": function(buffer) { return decode(buffer, builtSchema, schema.constructor === Array); }
  }
}

addTypeAlias('bool', 'boolean');

module.exports = {
  "build": build,
  "addTypeAlias": addTypeAlias,
  "changeStringEncoding": changeStringEncoding
}
