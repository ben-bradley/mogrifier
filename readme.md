# Mogrifier

Mogrifier is a simple type transmogrification library.  It allows you to define simple models/schemas and use them to transmogrify values to the types defined in your model.

It arose out of frustration with having to deal with Dates being sent via REST as `.toJSON()` values and then being stored in Mongo as strings instead of `ISODate`.

## Example

```javascript
'use strict';

import { mogrify } from 'mogrifier';

const model = {
  id: String,
  name: String,
  birthday: Date
};

const input = {
  id: 'abc123',
  name: 'Pat',
  birthday: '1981-01-01T00:00:00.000Z' // <- String, not a Date =(
};

let mogrified = mogrify(model, input);

console.log('before -', input);
console.log('after -', mogrified);

/*
before - { id: 'abc123',
  name: 'Pat',
  birthday: '1981-01-01T00:00:00.000Z' }
after - { id: 'abc123',
  name: 'Pat',
  birthday: Wed Dec 31 1980 16:00:00 GMT-0800 (PST) }
*/
```

## `mogrify(model, input)`

- `model` - Function, Object, Array - The model is the definition for how to mogrify the `input` and which type you use depends on the input you are working with.
- `input` - Any - The `input` is the value that you are trying to mogrify. Typically, this is a JSON Object or Array, but it can be a simple value as well.

## Defining a Model

There are three main ways to define a model.

### Model as a Type Constructor

This capability arose out of the recursive nature of the library, but it ends up being pretty useful. If you're not needing to mogrify objects or arrays, you can still mogrify values using constructors.

```javascript
const model = String; // <- you want to mogrify TO a String

let mogrified = mogrify(model, true);

console.log(mogrified); // -> 'true'
```

### Model as an Array

If your input is or has an Array, you can define that in the model.

```javascript
const model = [String]; // <- your input should be mogrified to an Array of Strings

let mogrified = mogrify(model, [ true, 0, new Date() ]);

console.log(mogrified); // -> [ 'true', '0', 'Wed Dec 31 1980 16:00:00 GMT-0800 (PST)' ]
```

### Model as an Object

Defining an object model is probably the most common and complex approach. The keys on your model object should match up with the keys on your input object that you want to mogrify into a specific type. Assigning the type constructor to the specific key will enforce the mogrification.

``` javascript
const model = {
  keyA: String,
  keyB: Number,
  keyC: Boolean,
  keyD: Date
};

const input = {
  keyA: 0,
  keyB: false,
  keyC: 'true',
  keyD: '1981-01-01T00:00:00.000Z'
};

let mogrified = mogrify(model, input);

console.log(mogrified);
/*
{ keyA: '0',
  keyB: 0,
  keyC: true,
  keyD: Wed Dec 31 1980 16:00:00 GMT-0800 (PST) }
 */
```

### Nested Objects and Arrays

Mogrification of nested objects and arrays is still pretty simple. You just follow the same pattern as above when you define your model and `mogrify()` will navigate the nesting to mogrify the types you've specified.

```javascript
const model = {
  id: String,
  name: { first: String, last: String }, // <- nested Object
  tags: [String], // <- nested Array containing Strings
  cats: [{ name: String, legs: Number }] // <- Object(s) within nested Array
};

const input = {
  id: 123456789, // <- oops, not a String
  name: { first: 'Pat', last: 'Jackson' },
  tags: [ 'foo', 'bar' ],
  cats: [
    { name: 'Tripod', legs: '3' }, // <- legs should be a Number
    { name: 'Monopod', legs: true }, // <- legs should be a Number
    { name: 'Hovercat', legs: false } // <- legs should be a Number
  ]
};

let mogrified = mogrify(model, input);

console.log(mogrified);
/*
{ id: '123456789',
  name: { first: 'Pat', last: 'Jackson' },
  tags: [ 'foo', 'bar' ],
  cats:
   [ { name: 'Tripod', legs: 3 },
     { name: 'Monopod', legs: 1 },
     { name: 'Hovercat', legs: 0 } ] }
 */
```

### Custom Type Constructors

If none of the built-in type constructors meet your needs, you can assign custom functions for mogrification.

```javascript
const model = {
  id: String,
  foo(value) { return value + '-bar'; }
};

const input = {
  id: 123456789,
  foo: 'foo' // <- should be "foo-bar"
};

let mogrified = mogrify(model, input);

console.log(mogrified); // <- { id: '123456789', foo: 'foo-bar' }
```

## Version

- 0.1.1 - Internal refactor to simplify `mogrifyArray()`
- 0.1.0 - Initial release
