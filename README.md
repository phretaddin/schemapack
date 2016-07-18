# schemapack

Efficiently encode your JavaScript objects in to compact byte buffers and then decode them back in to JavaScript objects on the receiver. Integrates very well with WebSockets.

## Example

```js
// On both the client and server:
var playerSchema = schemapack.build({
    health: "varuint",
    jumping: "boolean",
    position: [ "float32" ],
    attributes: { str: 'uint8', agi: 'uint8', int: 'uint8' }
});

// On the client:
var player = {
    health: 4000,
    jumping: false,
    position: [ 322.572, 159.281, 23.775 ],
    attributes: { str: 87, agi: 42, int: 22 }
};

var buffer = playerSchema.encode(player);
// Create a socket connection to server
socket.binaryType = 'arraybuffer';
socket.emit('player-message', buffer);

// On the server:
socket.on('player-message', function(buffer) { 
    var player = playerSchema.decode(buffer);
}
```

In this example, the size of payload is only **19 bytes**. Using `JSON.stringify` instead causes the payload to be **109 bytes**.

If you can't emit messages and can only send array buffers by themselves, add something like `__message: uint8` to the start of all your schemas/objects. On the receiver you can just read the first byte of the buffer to determine what the message type is.

## Motivation

I was working on an app that used WebSockets to talk between client and server. Usually when doing this the client and server just send JSON back and forth. However, when receiving a message the receiver already knows what the format of the message is going to be. Example:

```js
// Client:
var message = { 'sender': 'John', 'contents': 'hi' };
socket.emit('chat', message);

// Server
socket.on('chat', function(message) {
    // We know message is going to be an object with 'sender' and 'contents' keys
});
```

### The problems I had with sending JSON back and forth between client and server:
* It's a complete waste of bandwidth to send all those keys and delimiters when the object format is known.
* Even though `JSON.stringify` and `JSON.parse` are optimized native functions, they're slower than buffers.
* There's no implicit central message repository where I can look at the format of all my different packets.
* There's no validation so there's potential to have silent errors when accidentally sending the wrong message.

### Why I didn't just use an existing schema packing library:
* *Too complicated:* I didn't want to have to learn a schema language and format a schema for every object.
* *Too slow:* I benchmarked a couple of other popular libraries and they were often 10x slower than using the native `JSON.stringify` and `JSON.parse`. This library is often faster than even those native methods.
* *Too large:* I didn't want to use a behemoth library with tens of thousands of lines of code and many dependencies for something so simple. This library is 300 lines of code with no dependencies.
* *Too much overhead:* Some of the other libraries that allow you to specify a schema still waste a lot of bytes on padding/keys/etc. I desgined this library to not waste a single byte on anything that isn't your data.

## Benchmarks

These were performed via encoding/decoding the `player` object at the start of this page. Please note that these results are slightly variable and that each library tested may do better with other object structures. I encourage you to run these benchmarks yourself with your own objects to see what is best for you.

![Size](http://i.imgur.com/SZTKDCZ.png "Size")
![Speed](http://i.imgur.com/5Orm9PY.png "Speed")

Strings were excluded from the benchmark because they are difficult to properly measure. Most JavaScript engines store strings as trees that later have to later be flattened when sent over the wire so their true cost is deferred. SchemaPack will outperform the competition with medium to long strings, whereas JSON and MsgPack will do better with small strings where simple concatenation outweighs the cost of creating a buffer.

## Installation

On the server, you can just copy `schemapack.js` in to your project folder and `require` it. 

On the client, use webpack/browserify to automatically include the prerequisite `buffer` shim.

```js
var schemapack = require('./schemapack');
```

## API

### Build your schema:
```js
var personSchema = schemapack.build({
    name: 'string',
    age: 'uint8',
    weight: 'float32'
}); // This parses, sorts, validates, flattens, and then saves the resulting schema.
```

### Encode your objects:
```js
var john = {
    name: 'John Smith',
    age: 32,
    weight: 188.5
};
var buffer = personSchema.encode(john);
console.log(buffer); // <Buffer 20 0a 4a 6f 68 6e 20 53 6d 69 74 68 43 3c 80 00>
```

### Decode your buffers back to objects:
```js
var object = personSchema.decode(buffer);
console.log(object.name); // John Smith
console.log(object.age); // 32
console.log(object.weight); // 188.5
```

### Set the encoding used for strings:
`'utf8'` is the default. If you only need to support English, changing the string encoding to `'ascii'` can increase speed. Choose between `'ascii'`, `'utf8'`, `'utf16le'`, `'ucs2'`, `'base64'`, `'binary'`, and `'hex'`.

```js
schemapack.setStringEncoding('ascii');
```

### Add type aliases:
```js
schemapack.addTypeAlias('int', 'varuint');
var builtSchema = schemapack.build([ 'string', 'int' ]);
var buffer = builtSchema.encode([ 'dave', 1, 2, 3 ]);
var object = builtSchema.decode(buffer);
console.log(object); // [ 'dave', 1, 2, 3 ]
```

### Here is a table of the available data types for use in your schemas:

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
| string    |         | varuint length prefix followed by bytes of each character                                                                                               | Any string                      |
| varuint   |         | 1 byte when 0 to 127<br /> 2 bytes when 128 to 16,383<br /> 3 bytes when 16,384 to 2,097,151<br /> 4 bytes when 2,097,152 to 268,435,455<br /> etc.           | 0 to 9,007,199,254,740,991      |
| varint    |         | 1 byte when -64 to 63<br /> 2 bytes when -8,192 to 8,191<br /> 3 bytes when -1,048,576 to 1,048,575<br /> 4 bytes when -134,217,728 to 134,217,727<br /> etc. | -1,073,741,824 to 1,073,741,823        |

## Tests

Just clone the repository and go to the directory and run `node index.js` to run the test suite and benchmarks.

* To add `MsgPack` to the benchmarks, `npm install msgpack-lite` and uncomment line 6 in `tests.js`
* To add `Protocol Buffers` to the benchmarks, `npm install protobufjs` and uncomment line 7 in `tests.js`

## Compatibility

This library uses `Buffer` when in the `node.js` environment (always included) and the [buffer shim](https://github.com/feross/buffer#features) when in the browser (included with browserify/webpack).

## License

MIT
