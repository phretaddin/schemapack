const sp = require('schemapack');

// Define the schema
const playerSchema = sp.build({
  health: 'varuint',
  jumping: 'boolean',
  position: [ 'int16' ],
  attributes: { str: 'uint8', agi: 'uint8', int: 'uint8' },
});

// An object to serialize
const player = {
  health: 4000,
  jumping: false,
  position: [ -540, 343, 1201 ],
  attributes: { str: 87, agi: 42, int: 22 },
};

// Encode
const buffer = playerSchema.encode(player);
console.log(buffer);
// Decode
const decoded = playerSchema.decode(buffer);
console.log(decoded);
