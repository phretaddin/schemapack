import fs from 'fs';
import test from 'ava';
import sp from './schemapack.js';

const fixtures = fs.readdirSync('./fixtures');

fixtures.forEach(file => {
  test(file, t => {
    const { schema, items } = require(`./fixtures/${file}`);
    const built = sp.build(schema);

    items.forEach(item => {
      const processed = built.decode(built.encode(item));
      t.deepEqual(processed, item);
    });
  })
});
