'use strict';

import makeSure from 'make-sure';

const { isObject, isArray, isFunction, isUndefined } = makeSure;

export const mogrify = (model, data) => {
  if (isArray(model) && isArray(data))
    return data.map((value) => mogrify(model[0], value));
  else if (isObject(model) && isObject(data))
    return mogrifyObject(model, data);
  else if (isFunction(model) && !isArray(data) && !isObject(data))
    return cast(model, data);
}

const mogrifyObject = (model, data) => {
  let mogrified = Object.assign({}, data);

  for (let prop in mogrified) {
    let type = model[prop];

    if (isUndefined(type))
      continue;

    mogrified[prop] = mogrify(type, mogrified[prop]);
  }

  return mogrified;
}

const cast = (type, value) => {
  if (type === Boolean && value === 'false')
    return false;
  else if (type === Date)
    return new type(value);

  return type(value);
}

// oink!
