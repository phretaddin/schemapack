// MIT License
// Source: https://github.com/phretaddin/schemapack

'use strict';

var Buffer = require('buffer').Buffer;
var strEnc = 'utf8';
var aliasTypes = { };

function addTypeAlias(newTypeName, underlyingType) {
  var everyType = Object.keys(readTypeDictStr);
  var reservedKeys = [ '__arr', '__arrend', '__obj', '__objend' ];

  if (reservedKeys.indexOf(newTypeName) > -1 || reservedKeys.indexOf(underlyingType) > -1) {
    throw new TypeError("Cannot use reserved keys as a type alias or underlying type");
  } else if (everyType.indexOf(underlyingType) < 0) {
    throw new TypeError("Underlying type does not exist. Typo?");
  } else {
    aliasTypes[newTypeName] = underlyingType;
  }
}

function setStringEncoding(stringEncoding) {
  var requested = stringEncoding.trim().toLowerCase();
  var available = [ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ];
  if (available.indexOf(requested) > -1) { strEnc = requested; }
  else { throw new TypeError("String encoding not available"); }
}

function writeVarUInt(value, wBuffer) {
  while (value > 127) {
    wBuffer[bag.byteOffset++] = (value & 127) | 128;
    value >>= 7;
  }
  wBuffer[bag.byteOffset++] = value & 127;
}

function writeVarInt(value, wBuffer) {
  writeVarUInt((value << 1) ^ (value >> 31), wBuffer);
}

function readVarUInt(buffer) {
  var val = 0, i = 0, b;

  do {
    b = buffer[bag.byteOffset++];
    val |= (b & 127) << (7 * i);
    i++;
  } while (b & 128);

  return val;
}

function readVarInt(buffer) {
  var val = readVarUInt(buffer);
  return (val >>> 1) ^ -(val & 1);
}

function writeString(val, wBuffer) {
  var len = Buffer.byteLength(val, strEnc);
  writeVarUInt(len, wBuffer);
  bag.byteOffset += wBuffer.write(val, bag.byteOffset, len, strEnc);
}

function readString(buffer) {
  var len = readVarUInt(buffer);
  var str = buffer.toString(strEnc, bag.byteOffset, bag.byteOffset + len);
  bag.byteOffset += len;
  return str;
}

function peek(arr) { return arr[arr.length - 1]; }

var readTypeDictStr = {
  "boolean": "!!buffer.readUInt8(bag.byteOffset, true); bag.byteOffset += 1;",
  "int8": "buffer.readInt8(bag.byteOffset, true); bag.byteOffset += 1;",
  "uint8": "buffer.readUInt8(bag.byteOffset, true); bag.byteOffset += 1;",
  "int16": "buffer.readInt16BE(bag.byteOffset, true); bag.byteOffset += 2;",
  "uint16": "buffer.readUInt16BE(bag.byteOffset, true); bag.byteOffset += 2;",
  "int32": "buffer.readInt32BE(bag.byteOffset, true); bag.byteOffset += 4;",
  "uint32": "buffer.readUInt32BE(bag.byteOffset, true); bag.byteOffset += 4;",
  "float32": "buffer.readFloatBE(bag.byteOffset, true); bag.byteOffset += 4;",
  "float64": "buffer.readDoubleBE(bag.byteOffset, true); bag.byteOffset += 8;",
  "string": "bag.readString(buffer);",
  "varuint": "bag.readVarUInt(buffer);",
  "varint": "bag.readVarInt(buffer);"
};

function getWriteTypeDictStr(dataType, valStr) {
  switch (dataType) {
    case "boolean": return "bag.byteOffset = wBuffer.writeUInt8(" + valStr + " ? 1 : 0, bag.byteOffset, true);";
    case "int8": return "bag.byteOffset = wBuffer.writeInt8(" + valStr + ", bag.byteOffset, true);";
    case "uint8": return "bag.byteOffset = wBuffer.writeUInt8(" + valStr + ", bag.byteOffset, true);";
    case "int16": return "bag.byteOffset = wBuffer.writeInt16BE(" + valStr + ", bag.byteOffset, true);";
    case "uint16": return "bag.byteOffset = wBuffer.writeUInt16BE(" + valStr + ", bag.byteOffset, true);";
    case "int32": return "bag.byteOffset = wBuffer.writeInt32BE(" + valStr + ", bag.byteOffset, true);";
    case "uint32": return "bag.byteOffset = wBuffer.writeUInt32BE(" + valStr + ", bag.byteOffset, true);";
    case "float32": return "bag.byteOffset = wBuffer.writeFloatBE(" + valStr + ", bag.byteOffset, true);";
    case "float64": return "bag.byteOffset = wBuffer.writeDoubleBE(" + valStr + ", bag.byteOffset, true);";
    case "string": return "bag.writeString(" + valStr + ", wBuffer);";
    case "varuint": return "bag.writeVarUInt(" + valStr + ", wBuffer);";
    case "varint": return "bag.writeVarInt(" + valStr + ", wBuffer);";
  }
}

var constantByteCounts = { "boolean": 1, "int8": 1, "uint8": 1, "int16": 2, "uint16": 2, "int32": 4, "uint32": 4, "float32": 4, "float64": 8 };

var dynamicByteCounts = {
  "string": function(val) { var len = Buffer.byteLength(val, strEnc); return getVarUIntByteLength(len) + len; },
  "varuint": function(val) { return getVarUIntByteLength(val); },
  "varint": function(val) { return getVarIntByteLength(val); }
};

function getVarUIntByteLength(val) {
  if (val <= 0) { return 1; }
  return Math.floor(Math.log(val) / Math.log(128)) + 1;
}

function getVarIntByteLength(value) {
  return getVarUIntByteLength((value << 1) ^ (value >> 31));
}

var bag = {};
bag.getConstantRABC = getConstantRABC; // Repeated array byte count
bag.getDynamicRABC = getDynamicRABC;
bag.dynamicByteCounts = dynamicByteCounts;
bag.readVarUInt = readVarUInt;
bag.readVarInt = readVarInt;
bag.writeVarUInt = writeVarUInt;
bag.writeVarInt = writeVarInt;
bag.readString = readString;
bag.writeString = writeString;
bag.byteOffset = 0;

function getConstantRABC(arrLen, arrSchemaLength, byteCount, rootArray) {
  var bytes = rootArray ? 0 : getVarUIntByteLength(arrLen);
  
  return bytes + byteCount * (arrLen - arrSchemaLength);
}

function getDynamicRABC(arr, arrSchemaLength, repeatedDataType, rootArray) {
  var byteCount = rootArray ? 0 : getVarUIntByteLength(arr.length);
  var dynamicType = dynamicByteCounts[repeatedDataType];

  for (var j = arrSchemaLength; j < arr.length; j++) { 
    byteCount += dynamicType(arr[j]);
  }

  return byteCount;
}

function endEncodeArray(val, newID) {
  return "for (var j = " + val.length + "; j < " + "ref" + newID + ".length" + "; j++) { " + getWriteTypeDictStr(peek(val), "ref" + newID + "[j]") + "}";
}

function startEncodeArray(newID, parentID, prop) {
  return "var ref" + newID + "=ref" + parentID + "[" + prop + "];";
}

function encodeArrayLength(newID) {
  return "bag.writeVarUInt(ref" + newID + ".length,wBuffer);";
}

function startDecodeArray(newID, parentID, prop, arrLenStr) { 
  var str = "var ref" + newID + "=[];";
  str += "ref" + parentID + "[" + prop + "]=ref" + newID + ";";
  str += "var " + arrLenStr + "=bag.readVarUInt(buffer);";
  return str;
}

function endDecodeArray(val, newID, arrLenStr) {
  return "for (var k = " + val.length + "; k < " + arrLenStr + "; k++) { ref" + newID + "[k]=" + readTypeDictStr[peek(val)] + "}";
}

function startEncodeObject(newID, parentID, prop) {
  return "var ref" + newID + "=ref" + parentID + "[" + prop + "];";
}

function startDecodeObject(newID, parentID, prop) {
  var str = "var ref" + newID + "={};";
  str += "ref" + parentID + "[" + prop + "]=ref" + newID + ";";
  return str;
}

function readArrayToEnd(dataType) {
  return "for (var i = ref1.length; bag.byteOffset < buffer.length; i++) { ref1[i] = " + readTypeDictStr[dataType] + "}";
}

function encodeValue(dataType, x, prop) {
  var key = prop !== undefined ? "[" + prop + "]" : "";
  return getWriteTypeDictStr(dataType, "ref" + x + key);
}

function decodeValue(dataType, x, prop) {
  var key = prop !== undefined ? "[" + prop + "]" : "";
  return "ref" + x + key + "=" + readTypeDictStr[dataType];
}

function getArrayByteCount(dataType, refArr, schemaArr, rootArray) {
  if (constantByteCounts.hasOwnProperty(dataType)) {
    return "byteC+=bag.getConstantRABC(" + refArr + ".length," + schemaArr.length + "," +  constantByteCounts[dataType] + "," + rootArray + ");";
  } else {
    return "byteC+=bag.getDynamicRABC(" + refArr + "," + schemaArr.length + ",'" + dataType + "'," + rootArray + ");";
  }
}

function surroundByteCountStr(byteCountStr, byteCount) {
  return ("var byteC=" + byteCount + ";").concat(byteCountStr, "var wBuffer=Buffer.allocUnsafe(byteC);");
}

function getDynamicVarByteCount(dataType, saveID, prop) {
  var key = prop !== undefined ? "[" + prop + "]" : "";
  return "byteC+=bag.dynamicByteCounts['" + dataType + "'](ref" + saveID + key + ");";
}

function getDataType(val) {
  var everyType = Object.keys(readTypeDictStr);
  var dataType = val.trim().toLowerCase();
  if (aliasTypes.hasOwnProperty(dataType)) { dataType = aliasTypes[dataType]; }
  if (everyType.indexOf(dataType) === -1) { throw new TypeError("Invalid data type for schema."); }
  return dataType;
}

function getCompiledSchema(schema, schemaIsArray) {
  var strEncodeFunction = "bag.byteOffset=0;";
  var strDecodeFunction = "var ref1=schemaIsArray ? [] : {}; bag.byteOffset=0;";
  var strDynamicByteCount = "";
  var strEncodeRefDecs = "var ref1=json;";
  var incID = 0;
  var cByteCount = 0;

  function compileSchema(json, inArray) {
    incID++;
    var keys = Object.keys(json);
    keys.sort(function(a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); });

    var saveID = incID;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = json[key];
      
      if (inArray) { key = +key; }

      var prop = typeof key === "number" ? key : "'" + key + "'";

      if (val.constructor === Array) {
        var newID = incID + 1;
        var parentID = saveID;
        var arrLenStr = "arrLen" + incID;

        strEncodeRefDecs += startEncodeArray(newID, parentID, prop);
        strEncodeFunction += encodeArrayLength(newID);

        strDecodeFunction += startDecodeArray(newID, parentID, prop, arrLenStr);

        var dataType = peek(val);

        strDynamicByteCount += getArrayByteCount(dataType, "ref" + newID, val, false);
        
        compileSchema(val, true);

        strEncodeFunction += endEncodeArray(val, newID);
        strDecodeFunction += endDecodeArray(val, newID, arrLenStr);
      } else if (typeof val === 'object') {
        var newID = incID + 1;
        var parentID = saveID;

        strEncodeRefDecs += startEncodeObject(newID, parentID, prop);
        strDecodeFunction += startDecodeObject(newID, parentID, prop);

        compileSchema(val, false);
      } else {
        var dataType = getDataType(val);
        json[key] = dataType;

        if (constantByteCounts.hasOwnProperty(dataType)) { cByteCount += constantByteCounts[dataType]; }
        else { strDynamicByteCount += getDynamicVarByteCount(dataType, saveID, prop); }

        strEncodeFunction += encodeValue(dataType, saveID, prop);
        strDecodeFunction += decodeValue(dataType, saveID, prop);
      }
    }
  }

  if (typeof schema === "string") { // Single item schema
    var dt = getDataType(schema);
    var dtBytes = constantByteCounts.hasOwnProperty(dt) ? constantByteCounts[dt] : "bag.dynamicByteCounts['" + dt + "'](json)";
    strEncodeFunction = "bag.byteOffset=0; var wBuffer=Buffer.allocUnsafe(" + dtBytes + ");" + getWriteTypeDictStr(dt, "json") + "return wBuffer;";
    strDecodeFunction = "bag.byteOffset=0;" + "var item=" + readTypeDictStr[dt] + "return item;";
  } else {
    compileSchema(schema, schemaIsArray);

    if (schemaIsArray) {
      var repeatedDataType = peek(schema);

      strDynamicByteCount += getArrayByteCount(repeatedDataType, "json", schema, true);
      strEncodeFunction += endEncodeArray(schema, 1);
      strDecodeFunction += readArrayToEnd(repeatedDataType);
    }

    strDynamicByteCount = surroundByteCountStr(strDynamicByteCount, cByteCount);
    strEncodeFunction = strEncodeRefDecs.concat(strDynamicByteCount, strEncodeFunction, "return wBuffer;");
    strDecodeFunction = strDecodeFunction.concat('return ref1;');
  }

  var compiledEncode = new Function('json', 'bag', strEncodeFunction);
  var compiledDecode = new Function('schemaIsArray', 'buffer', 'bag', strDecodeFunction);

  return [ compiledEncode, compiledDecode ];
}

function build(schema) { 
  var schemaIsArray = schema.constructor === Array;
  var builtSchema = getCompiledSchema(schema, schemaIsArray);

  var compiledEncode = builtSchema[0];
  var compiledDecode = builtSchema[1];

  return {
    "encode": function(json) { 
      return compiledEncode(json, bag);
    },
    "decode": function(buffer) { 
      var buf = buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;
      return compiledDecode(schemaIsArray, buf, bag);
    }
  }
}

addTypeAlias('bool', 'boolean');

module.exports = exports = {
  "build": build,
  "addTypeAlias": addTypeAlias,
  "setStringEncoding": setStringEncoding
};
