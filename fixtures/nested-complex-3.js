module.exports.schema = [ 
  { "nesty": { "deep": [ "string", [ "int8" ], "varuint" ] } }
];

module.exports.items = [[
  { "nesty": { "deep": [ "asdf", [ 1, 2, 3 ], 33 ] } },
  { "nesty": { "deep": [ "qwer", [ 22, 1 ], 4 ] } }
]];
