// MIT License
// Source: https://github.com/phretaddin/schemapack

'use strict';

var Buffer = require('buffer').Buffer;
var byteOffset = 0;
var strEnc = 'utf8';
var aliasTypes = { };

function getEveryType() {
  var constantKeys = Object.keys(constantByteCount);
  var dynamicKeys = Object.keys(dynamicByteCount);

  return constantKeys.concat(dynamicKeys);
}

function addTypeAlias(newTypeName, underlyingType) {
  var everyType = getEveryType();
  var reservedKeys = [ '__arr', '__arrend', '__obj', '__objend' ];

  if (reservedKeys.indexOf(newTypeName) > -1 || reservedKeys.indexOf(underlyingType) > -1) {
    throw new TypeError("Cannot use reserved keys as a type alias or underlying type");
  } else if (everyType.indexOf(underlyingType) < 0) {
    throw new TypeError("Underlying type does not exist. Typo?");
  } else {
    aliasTypes[newTypeName] = underlyingType;
  }
}

var setStringEncoding = function(stringEncoding) {
  var requested = stringEncoding.trim().toLowerCase();
  var available = [ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ];
  if (available.indexOf(requested) > -1) { strEnc = requested; }
  else { throw new TypeError("String encoding not available"); }
};

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
  var s = str.length;

  if (strEnc === "ascii") { return s; }
  
  for (var i = s - 1; i >= 0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) { s++; }
    else if (code > 0x7ff && code <= 0xffff) { s += 2; }
    if (code >= 0xDC00 && code <= 0xDFFF) { i--; } // Trail surrogate
  }
  
  return s;
}

function writeString(buffer, val) {
  var len = getStringByteLength(val);
  writeVarUInt(buffer, len);
  byteOffset += buffer.write(val, byteOffset, len, strEnc);
}

function readString(buffer, strLen) {
  var str = buffer.toString(strEnc, byteOffset, byteOffset + strLen);
  byteOffset += strLen;
  return str;
}

function peek(arr) { return arr[arr.length - 1]; }

function getArrayByteCount(arr, key, schema, i) {
  var len = arr.length;
  var byteCount = getVarUIntByteLength(len);
  var repeatCount = len - key;

  if (repeatCount > 0) {
    var repeatedDataType = schema[i - 1];

    switch (repeatedDataType) {
      case "varuint":
      case "varint":
      case "string": { for (var j = key; j < len; j++) { byteCount += dynamicByteCount[repeatedDataType](arr[j]); } break; }
      default: byteCount += (constantByteCount[repeatedDataType] * repeatCount); break;
    }
  }

  return byteCount;
}

function writeArray(arr, key, repeatedDataType, buffer) {
  var repeatCount = arr.length - key;

  if (repeatCount > 0) {
    for (var j = key; j < arr.length; j++) {
      writeTypeDict[repeatedDataType](buffer, arr[j]);
    }
  }
}

function readArray(len, key, val, repeatedDataType, buffer) {
  for (var j = key; j < len; j++) {
    readTypeDict[repeatedDataType](buffer, j, val);
  }
}

function calculateByteCount(obj, schema) {
  var refStack = [ obj ];
  var byteCount = 0;

  for (var i = 0; i < schema.length; i += 2) {
    var key = schema[i];
    var dataType = schema[i + 1];

    switch (dataType) {
      case "__arrend": { byteCount += getArrayByteCount(refStack.pop(), key, schema, i); break; }
      case "__obj": { refStack.push(peek(refStack)[key]); break; }
      case "__arr": { refStack.push(peek(refStack)[key]); break; }
      case "string":
      case "varuint":
      case "varint": { byteCount += dynamicByteCount[dataType](peek(refStack)[key]); break; }
      case "__objend": { refStack.pop(); break; }
      default: { byteCount += constantByteCount[dataType]; break; }
    }
  }

  return byteCount;  
}

function encode(json, schema, schemaIsArray) {
  var obj = schemaIsArray ? [json] : json;
  var buffer = Buffer.allocUnsafe(calculateByteCount(obj, schema));
  var refStack = [ obj ];
  byteOffset = 0;

  for (var i = 0; i < schema.length; i += 2) {
    var key = schema[i];
    var dataType = schema[i + 1];
    var val = peek(refStack)[key];

    switch (dataType) {
      case "__arrend": { writeArray(refStack.pop(), key, schema[i - 1], buffer); break; }
      case "__arr": { writeVarUInt(buffer, val.length); refStack.push(val); break; }
      case "__obj": { refStack.push(val); break; }
      case "__objend": { refStack.pop(); break; }
      default: { writeTypeDict[dataType](buffer, val); break; }
    }
  }
  return buffer;
}

function decode(buffer, schema, schemaIsArray) {
  if (buffer instanceof ArrayBuffer) { buffer = Buffer.from(buffer); }
  
  var refStack = [ schemaIsArray ? [] : {} ];
  var arrayLengthStack = [];
  
  byteOffset = 0;

  for (var i = 0; i < schema.length; i += 2) {
    var key = schema[i];
    var dataType = schema[i + 1];
    var val = peek(refStack);

    switch (dataType) {
      case "__arrend": { readArray(arrayLengthStack.pop(), key, val, schema[i - 1], buffer); refStack.pop(); break; }
      case "__arr": { arrayLengthStack.push(readVarUInt(buffer)); var arr = []; val[key] = arr; refStack.push(arr); break; }
      case "__obj": { var obj = {}; val[key] = obj; refStack.push(obj); break; }
      case "__objend": { refStack.pop(); break; }
      default: { readTypeDict[dataType](buffer, key, val); }
    }
  }

  return schemaIsArray ? peek(refStack)[0] : peek(refStack);
}

var constantByteCount = {
  "boolean": 1,
  "int8": 1,
  "uint8": 1,
  "int16": 2,
  "uint16": 2,
  "int32": 4,
  "uint32": 4,
  "float32": 4,
  "float64": 8,
};

var dynamicByteCount = {
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

function getFlattened(schema, schemaIsArray) {
  var everyType = getEveryType();

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
        if (aliasTypes.hasOwnProperty(dataType)) { dataType = aliasTypes[dataType]; }
        if (everyType.indexOf(dataType) > -1) { flattened.push(key, dataType); }
        else { throw new TypeError("Invalid data type in schema."); }
      }
    }
  }
  var flattened = [];

  if (schemaIsArray) {
    flattened.push(0, '__arr');
    flatten(schema, [], true);
    flattened.push(schema.length, '__arrend');
  } else {
    flatten(schema, [], false);
  }
  
  return flattened;
}

function build(schema) { 
  var schemaIsArray = schema.constructor === Array;
  var builtSchema = getFlattened(schema, schemaIsArray);
  
  return {
    "encode": function(json) { return encode(json, builtSchema, schemaIsArray); },
    "decode": function(buffer) { return decode(buffer, builtSchema, schemaIsArray); }
  }
}

addTypeAlias('bool', 'boolean');

module.exports = exports = {
  "build": build,
  "addTypeAlias": addTypeAlias,
  "setStringEncoding": setStringEncoding
};
