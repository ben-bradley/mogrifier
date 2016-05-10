'use strict';

import makeSure from 'make-sure';

const { isObject, isArray, isFunction, isUndefined } = makeSure;

export const mogrify = (model, data) => {
  if (isArray(model) && isArray(data))
    return mogrifyArray(model[0], data);
  else if (isObject(model) && isObject(data))
    return mogrifyObject(model, data);
  else if (isFunction(model) && !isArray(data) && !isObject(data))
    return cast(model, data);
}

const mogrifyObject = (model, data) => {
  let mogrifyd = Object.assign({}, data);

  for (let prop in mogrifyd) {
    let type = model[prop];

    if (isUndefined(type))
      continue;

    mogrifyd[prop] = mogrify(type, mogrifyd[prop]);
  }

  return mogrifyd;
}

const mogrifyArray = (model, data) => {
  if (isObject(model))
    return data.map((value) => mogrifyObject(model, value));
  else if (isFunction(model))
    return data.map((value) => cast(model, value));
}

const cast = (type, value) => {
  if (type === Boolean && value === 'false')
    return false;
  else if (type === Date)
    return new type(value);

  return type(value);
}

// oink!
