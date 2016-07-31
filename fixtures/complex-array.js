module.exports.schema = [
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

module.exports.items = [[
  1225.2347,
  false,
  23,
  5555,
  [ true, [7, [-866, 4453, 5234234, 4543434, 4544666], 1, 100, 10000 ], "hi" ],
  {
    points: [ 3434, 546, 1212, 66 ],
    name: "lilIlilIlilIlilIlilIlil"
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
]];
