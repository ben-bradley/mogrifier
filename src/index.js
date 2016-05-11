'use strict';

import makeSure from 'make-sure';

const { isObject, isArray, isFunction, isUndefined } = makeSure;

const defaultOptions = {
  strict: false
};

export const mogrify = (model, data, options = {}) => {
  if (isUndefined(model) || isUndefined(data))
    throw new Error('mogrify expects a model and data argument');

  options = Object.assign({}, defaultOptions, options);

  if (isArray(model) && isArray(data))
    return data.map((value) => mogrify(model[0], value, options));
  else if (isObject(model) && isObject(data))
    return mogrifyObject(model, data, options);
  else if (isFunction(model) && !isArray(data) && !isObject(data))
    return cast(model, data, options);
}

const mogrifyObject = (model, data, options) => {
  let mogrified = Object.assign({}, data);

  for (let prop in mogrified) {
    let type = model[prop];

    if (isUndefined(type) && options.strict === false)
      continue;
    else if (isUndefined(type) && options.strict === true) {
      mogrified[prop] = null;
      delete mogrified[prop];
      continue;
    }

    mogrified[prop] = mogrify(type, mogrified[prop], options);
  }

  return mogrified;
}

const cast = (type, value, options) => {
  if (type === Boolean && value === 'false')
    return false;
  else if (type === Date)
    return new type(value);

  return type(value);
}

// oink!
