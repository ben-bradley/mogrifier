'use strict';

var _ = require('./');

var model = {
  id: String,
  name: { first: String, last: String }, // <- nested Object
  tags: [String], // <- nested Array containing Strings
  cats: [{ name: String, legs: Number }] // <- Object(s) within nested Array
};

var input = {
  id: 123456789,
  name: { first: 'Pat', last: 'Jackson' },
  tags: ['foo', 'bar'],
  cats: [{ name: 'Tripod', legs: '3' }, { name: 'Monopod', legs: true }, { name: 'Hovercat', legs: false }]
};

var mogrified = (0, _.mogrify)(model, input);

console.log('before -', input);
console.log('after -', mogrifyd);