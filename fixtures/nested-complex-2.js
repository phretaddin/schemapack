module.exports.schema = {
  "asdf": [ 
    { "nested": { "further": [ "string", [ "int8" ], "varuint" ] } }
  ]
};

module.exports.items = [{
  "asdf": [
    { "nested": { "further": [ "asdf", [ 1, 2, 3 ], 33 ] } },
    { "nested": { "further": [ "zxcv", [ 22, 1 ], 4 ] } }
  ]
}];
