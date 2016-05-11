'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mogrify = undefined;

var _makeSure = require('make-sure');

var _makeSure2 = _interopRequireDefault(_makeSure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isObject = _makeSure2.default.isObject;
var isArray = _makeSure2.default.isArray;
var isFunction = _makeSure2.default.isFunction;
var isUndefined = _makeSure2.default.isUndefined;
var mogrify = exports.mogrify = function mogrify(model, data) {
  if (isArray(model) && isArray(data)) return data.map(function (value) {
    return mogrify(model[0], value);
  });else if (isObject(model) && isObject(data)) return mogrifyObject(model, data);else if (isFunction(model) && !isArray(data) && !isObject(data)) return cast(model, data);
};

var mogrifyObject = function mogrifyObject(model, data) {
  var mogrified = Object.assign({}, data);

  for (var prop in mogrified) {
    var type = model[prop];

    if (isUndefined(type)) continue;

    mogrified[prop] = mogrify(type, mogrified[prop]);
  }

  return mogrified;
};

var cast = function cast(type, value) {
  if (type === Boolean && value === 'false') return false;else if (type === Date) return new type(value);

  return type(value);
};

// oink!