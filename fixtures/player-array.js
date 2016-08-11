module.exports.schema = [{
  health: "varuint",
  jumping: "boolean",
  position: [ "int16" ],
  attributes: { str: 'uint8', agi: 'uint8', int: 'uint8' }
}];

module.exports.items = [[{
  health: 4000,
  jumping: false,
  position: [ -540, 343, 1201 ],
  attributes: { str: 87, agi: 42, int: 22 }
},
{
  health: 3000,
  jumping: false,
  position: [ -540, 22, 1201 ],
  attributes: { str: 7, agi: 77, int: 11 }
}]];
