# schemapack

Efficiently encode your JavaScript objects in to compact byte buffers and then decode them back in to the JavaScript objects on the receiver. Integrates very well with WebSockets.

## Object Example

```js
// On both the client and server:
var playerSchema = schemapack.build({
    health: "uint16",
    level: "uint8",
    jumping: "boolean",
    position: [ "varuint" ],
    name: "string",
    stats: { str: 'uint8', agi: 'uint8', int: 'uint8' }
});

// On the client:
var player = {
    health: 4000,
    level: 50,
    jumping: false,
    position: [ 20, 400, 300 ],
    name: "John",
    stats: { str: 87, agi: 42, int: 22 }
};
var buffer = playerSchema.encode(player);
// Create a socket connection to a remote server
socket.binaryType = 'arraybuffer';
socket.emit('player-message', buffer);

// On the server:
socket.on('player-message', function(buffer) { 
    var player = playerSchema.decode(buffer);
}
```

In this example, the size of payload is only **18 bytes**. If you had used `JSON.stringify` instead, the payload would have been **117 bytes** (10x larger than necessary).
    
## Array Example
```js
var personSchema = schemapack.build([ "string", "int8", "float32" ]); // Name, age, height

var person = [ "Dave", 37, 1.88 ];
var buffer = builtPersonSchema.encode(person);
var object = builtPersonSchema.decode(buffer);
```

By the way, the last item in nested schema arrays can be repeated. That is, a schema of `[ "string", ["int"] ]` accepts `[ "a", [5] ]`, `[ "a", [5, 10] ]`, etc.

## Motivation

I was working on a web app that used WebSockets to communicate between client and server. Usually when doing this the client and server just send JSON back and forth to each other. However, when receiving a message the receiver already knows what the format of the message is going to be. Example:

```js
// Client:
var message = { 'sender': 'John', 'contents': 'hi' };
socket.emit('chatmessage', message);

// Server
socket.on('chatmessage', function(message) {
    // We know message is going to be an object with 'sender' and 'contents' keys
    // Waste of bandwidth and CPU to continuously send this extraneous data back and forth.
});
```

##### The problems I had with sending JSON back and forth between client and server:
* It's a complete waste of bandwidth to send all those keys and delimiters when the object format is known.
* Even though `JSON.stringify` and `JSON.parse` are optimized native functions, they're slower than buffers.
* There's no implicit central message repository where I can look at the format of all my different packets.
* There's no validation so there's potential to have silent errors when accidentally sending the wrong message.

##### Why I didn't just use an existing schema packing library:
* *Too complicated:* I didn't want to have to learn a schema language and reformat all of my objects to match it.
* *Too slow:* I benchmarked a couple of other popular libraries and they were often 10x slower than using the native `JSON.stringify` and `JSON.parse`. This library is faster than even those native methods.
* *Too large:* I didn't want to use a behemoth library with tens of thousands of lines of code and tons of dependencies for something so simple. This library is less than 400 lines of code.
* *Too much overhead:* Some of the other libraries that allow you to specify a schema still waste a lot of bytes on padding/keys/etc. I desgined this library to not waste a single byte on anything that isn't your data.

## Benefits

* *Easy:* Don't have to learn a schema language. It's just JSON that matches your object format. To make a schema, just copy and paste the object you were going to send and replace its values with the types they represent. Done.
* *Speed:* The fastest JavaScript object encoder/decoder available. Even beats native `JSON.stringify` and `JSON.parse`.
* *Small:* Just 300 lines of code and no dependencies.
* *Simple:* Just import the library, build a JSON schema, and call encode/decode. 
* *No overhead:* When an object is encoded, the resulting buffer consists solely of compact data. Keys, delimiters, etc. are all stripped out and only recreated on the receiving end.
* *Validation:* If the schema is invalid, an error will be thrown. Likewise, if the object to encode/decode does not match the size of the schema, the program will crash. Useful for ensuring all messages match their format.
* *Bandwidth Efficiency:* The amount of bytes sent over the wire is often 10x or more less than the JSON alternative, due to removing keys and delimiters along with using compact data types.

## Installation

Just copy schemapack.js in to your project directory and use it like this:

```js
var schemapack = require('./schemapack');
var builtSchema = schemapack.build(yourJSONSchema);
var buffer = builtSchema.encode(object);
var object = builtSchema.decode(buffer);
console.log(object);
```

Everything is included in that file. In the `node.js` environment, there are no dependencies. In the browser, as long as you use browserify/webpack, there are no dependencies either.

## API Reference

### schemapack.build(schema)

**Description:** This function takes a JavaScript object that matches the structure and format of the objects you will encode. To create a `schema`, copy and paste the JSON of your object you will encode and replace its key values with the data types they represent. This function then takes the schema, parses it, sorts it (for deterministic iteration), validates it, flattens it (for efficient iteration), and then saves it for use in the coming encode/decode functions.

**Arguments:** `schema` - A JavaScript object matching the structure of the object you will encode.

**Returns**: An object with `encode` and `decode` functions that operate based on `schema`.

### encode(obj)

**Description:** This function is called from the object returned from `schemapack.build`. It uses the schema specified in the `build` function to pack all the data in to a compact buffer (usually for then sending over the internet).

**Arguments:** *`obj`* - The Javascript object you want to encode in to a packed binary buffer.

**Returns**: `Buffer` consisting soley of the bytes required to reproduce the object with decode.

### decode(buffer)

**Description:** This function is called from the object returned from `schemapack.build`. It uses the schema specified in the `build` function to decode the passed in buffer back in to a JavaScript object.

**Arguments:** *`buffer`* - The buffer that was returned from the corresponding `encode` call.

**Returns**: `JavaScript object` recreated from given schema and buffer.

### schemapack.changeStringEncoding(stringEncoding)

**Description:** The string encoding to use for all strings encoded/decoded from schemapack. UTF8 is the default and is the most standardized string encoding to use, while also being the most byte-efficient. However, if you are only using English characters and symbols, changing the string encoding to `ascii` will make encoding/decoding much faster.

**Arguments:** *`stringEncoding`*: The string encoding to now use. Choose between `[ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ]`.

**Example**: 

```js
schemapack.changeStringEncoding('ascii');
```

### schemapack.addTypeAlias(newTypeName, underlyingType)

**Arguments:** 
 * *`newTypeName`*: The name of type that will be used as an alias for the underlying type.
 * *`underlyingType`*: One of the above types in the 'available data types' table.

**Example**: 

```js
schemapack.addTypeAlias('int', 'int32');
var builtSchema = schemapack.build([ 'bool', 'int' ]);
```

## Here is a table of the available data types for use in your schemas:

| Type Name | Aliases | Bytes                                                                                                                                                         | Range of Values                 |
|-----------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| bool      | boolean | 1                                                                                                                                                             | True or false                   |
| int8      |         | 1                                                                                                                                                             | -128 to 127                     |
| uint8     |         | 1                                                                                                                                                             | 0 to 255                        |
| int16     |         | 2                                                                                                                                                             | -32,768 to 32,767               |
| uint16    |         | 2                                                                                                                                                             | 0 to 65,535                     |
| int32     |         | 4                                                                                                                                                             | -2,147,483,648 to 2,147,483,647 |
| uint32    |         | 4                                                                                                                                                             | 0 to 4,294,967,295              |
| float32   |         | 4                                                                                                                                                             | 3.4E +/- 38 (7 digits)          |
| float64   |         | 8                                                                                                                                                             | 1.7 +/- 308 (15 digits)         |
| string    |         | varuint length prefix followed by UTF-8 bytes of each character                                                                                               | Any string                      |
| varuint   |         | 1 byte when 0 to 127<br /> 2 bytes when 128 to 16,383<br /> 3 bytes when 16,385 to 2,097,151<br /> 4 bytes when 2,097,152 to 268,435,455<br /> etc.           | 0 to 9,007,199,254,740,991      |
| varint    |         | 1 byte when -64 to 63<br /> 2 bytes when -8,192 to 8,191<br /> 3 bytes when -1,048,576 to 1,048,575<br /> 4 bytes when -134,217,728 to 134,217,727<br /> etc. | -1073741824 - 1073741823        |

Feel free to add your own aliases with `schemapack.addTypeAlias`.

## Tests

You may need to `npm install` packages like `msgpack` and `protobuf` if you want to include them in the benchmark.

```js
var tests = require('./tests');
tests.runBenchmark();
tests.runTestSuite();
```

## Compatibility

This library uses `Buffer` when in the `node.js` environment and the [buffer shim](https://github.com/feross/buffer#features) when in the browser.

## License

MIT
