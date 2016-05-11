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


var defaultOptions = {
  strict: false
};

var mogrify = exports.mogrify = function mogrify(model, data) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  if (isUndefined(model) || isUndefined(data)) throw new Error('mogrify expects a model and data argument');

  options = Object.assign({}, defaultOptions, options);

  if (isArray(model) && isArray(data)) return data.map(function (value) {
    return mogrify(model[0], value, options);
  });else if (isObject(model) && isObject(data)) return mogrifyObject(model, data, options);else if (isFunction(model) && !isArray(data) && !isObject(data)) return cast(model, data, options);
};

var mogrifyObject = function mogrifyObject(model, data, options) {
  var mogrified = Object.assign({}, data);

  for (var prop in mogrified) {
    var type = model[prop];

    if (isUndefined(type) && options.strict === false) continue;else if (isUndefined(type) && options.strict === true) {
      mogrified[prop] = null;
      delete mogrified[prop];
      continue;
    }

    mogrified[prop] = mogrify(type, mogrified[prop], options);
  }

  return mogrified;
};

var cast = function cast(type, value, options) {
  if (type === Boolean && value === 'false') return false;else if (type === Date) return new type(value);

  return type(value);
};

// oink!