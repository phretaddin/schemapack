# schemapack

Create a schema object to encode/decode your JSON in to a compact byte buffer with no overhead. Integrates very well with WebSockets.

## Object Example

    // This object goes on both the client and server
    var playerSchema = {
      health: "uint16",
      level: "uint8",
      jumping: "boolean",
      position: [ "varuint" ],
      name: "string",
      stats: {
        str: 'uint8',
        agi: 'uint8',
        int: 'uint8'
      }
    };

    // Object on the client that matches the schema
    var player = {
      health: 4000,
      level: 50,
      jumping: false,
      position: [ 20, 400, 300 ],
      name: "Warrior",
      stats: {
        str: 87,
        agi: 42,
        int: 22
      }
    };

    var buffer = schemapack.encode(playerSchema, player);
    socket.binaryType = 'arraybuffer';
    socket.emit('player-message', buffer);

    // On the server
    socket.on('player-message', function(buffer) { 
      var player = schemapack.decode(playerSchema, buffer);
    }

    In this example, the size of buffer in bytes is only 15 bytes. The stringified JSON version would have been 120 bytes.
    
## Array Example

    var personSchema = [ "string", "int8", "float32" ]; // Name, age, height
    var person = [ "Dave", 37, 1.88 ];
    var buffer = schemapack.encode(personSchema, person);
    var object = schemapack.decode(personSchema, buffer);

    The last item in schema arrays can be repeated. That is, a schema of [ "string", "bool", "int" ] accepts [ "a", false, 5 ], [ "a", false, 5, 6 ], etc.

## Motivation

I was working on a web app that used WebSockets to communicate between client and server. Usually when doing this the client and server just send JSON back and forth to each other. However, when receiving a message the receiver already knows what the format of the message is going to be. Example:

    // Client:
    var message = { 'sender': 'John', 'contents': 'hi' };
    socket.emit('chatmessage', message);

    // Server
    socket.on('chatmessage', function(message) {
      // We know message is going to be an object with 'sender' and 'contents' keys
    });

It seemed silly to 

When JSON is sent over the wire, it is just sent as a string. So a 5 digit number, 12345, would be sent as 5 bytes. With JSON, you also have to send the key names as part of the payload. While this may not be always be a problem, if you were making something multiplayer where each player sent 60 updates per second to the server, the bandwidth costs of repeatedly sending this superfluous data quickly adds up. Add in the benefits of having a central repository of message formats along with the validation and error-checking that a schema provides, and the motivation becomes clear.

## Benefits

* Easy: Don't have to learn a schema language. It's just JSON that matches your object format. To make a schema, just copy and paste the object you were going to send and replace its values with the types they represent. Done.
* Speed: Many times faster than other binary packing libraries on both encoding and decoding.
* Small: Just 300 lines of code with no dependencies.
* Simple: Just import the library, create a JSON schema, and call encode/decode with it and your object. 
* No overhead: When an object is encoded, the resulting buffer consists solely of compact data. Keys, delimiters, etc. are all stripped out and recreated on the receiving end.
* Validation: If the object provided to encode doesn't match the size of the schema, the program will crash on encode. Useful for making sure all your messages match the required format.
* Bandwidth Efficiency: The amount of bytes sent over the wire is often 10x or more less than the JSON alternative, due to removing keys and delimiters along with using compact data types.

## Installation

Just copy schemapack.js in to your project directory and use it like this:

    var schemapack = require('./schemapack');
    // var buffer = schemapack.encode(schema, object);
    // var object = schemapack.decode(schema, buffer);

Everything is included in that file and it has no dependencies.

## API Reference

### encode(schema, obj)

* `schema` - Object with the same format as obj, with values replaced with the data types they represent.
* `obj` - The variable you want to encode in to a packed binary buffer.

**Returns**: `Uint8Array` buffer consisting soley of the bytes required to reproduce the object with decode.

### decode(schema, buffer)

**Arguments**

* `schema` - The same schema object used to encode the passed in buffer.
* `buffer` - The `Uint8Array` binary buffer that was returned from the corresponding `encode` call.

**Returns**: `JavaScript object` recreated from given schema and buffer.

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

### addTypeAlias(newTypeName, underlyingType)

*newTypeName*: The name of type that will be used as an alias for the underlying type.

*underlyingType*: One of the above types in the 'available data types' table.

**Example**: 

    schemapack.addTypeAlias('int', 'int32');
    schemapack.encode([ 'bool', 'int' ], [ true, 55 ]);

## Tests

You may need to `npm install` packages like `msgpack` and `protobuf` if you want to include them in the benchmark.

    var tests = require('./tests');
    tests.runBenchmark();
    tests.runTestSuite();

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## Issues

Warning: Although object key order is preserved in all current browser implementations (except for keys like "7" that parse as integers), it is not guaranteed.
For this reason it is recommended to send arrays instead of keyed objects until a potential solution can be integrated in to the project.

## Compatibility

This library uses DataView. [The availability for this interface is listed here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView#Browser_compatibility)

## License

MIT
