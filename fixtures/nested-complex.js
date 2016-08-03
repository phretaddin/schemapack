module.exports.schema = {
  "asdf": [ 
    "string", 
    "varuint", 
    { "nesty": { "deep": "varuint" } }
  ]
};

module.exports.items = [{
  "asdf": [
    "hello",
    5000,
    { "nesty": { "deep": 55 } },
    { "nesty": { "deep": 4 } }
  ]
}];
