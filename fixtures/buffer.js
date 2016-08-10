module.exports.schema = {
  b: "buffer",
  c: "buffer",
  a: "buffer",
  d: "buffer"
};

module.exports.items = [{
  b: new Buffer([0x01, 0x02, 0x03, 0x04]),
  c: new Buffer([0x05, 0x06, 0x07, 0x08]),
  a: new Buffer([0x09, 0x0A, 0x0B, 0x0C]),
  d: new Buffer([0x0D, 0x0E, 0x0F, 0x10])
}];