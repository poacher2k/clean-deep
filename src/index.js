
/**
 * Module dependencies.
 */

const isEmpty = require('lodash.isempty');
const isPlainObject = require('lodash.isplainobject');
const transform = require('lodash.transform');

/**
 * Export `cleanDeep` function.
 */

module.exports = function cleanDeep(object, {
  cleanKeys = [],
  cleanKeysPrefixes = [],
  cleanValues = [],
  cleanValuesPrefixes = [],
  emptyArrays = true,
  emptyObjects = true,
  emptyStrings = true,
  NaNValues = false,
  nullValues = true,
  undefinedValues = true
} = {}) {
  return transform(object, (result, value, key) => {
    // Exclude specific keys.
    if (cleanKeys.includes(key)) {
      return;
    }

    // Exclude keys with specific prefixes.
    if (typeof key === 'string' && cleanKeysPrefixes.some((prefix) => key.startsWith(prefix))) {
      return;
    }

    // Recurse into arrays and objects.
    if (Array.isArray(value) || isPlainObject(value)) {
      value = cleanDeep(value, { NaNValues, cleanKeys, cleanKeysPrefixes, cleanValues, cleanValuesPrefixes, emptyArrays, emptyObjects, emptyStrings, nullValues, undefinedValues });
    }

    // Exclude specific values.
    if (cleanValues.includes(value)) {
      return;
    }

    // Exclude string values with specific prefixes.
    if (typeof value === 'string' && cleanValuesPrefixes.some((prefix) => value.startsWith(prefix))) {
      return;
    }

    // Exclude empty objects.
    if (emptyObjects && isPlainObject(value) && isEmpty(value)) {
      return;
    }

    // Exclude empty arrays.
    if (emptyArrays && Array.isArray(value) && !value.length) {
      return;
    }

    // Exclude empty strings.
    if (emptyStrings && value === '') {
      return;
    }

    // Exclude NaN values.
    if (NaNValues && Number.isNaN(value)) {
      return;
    }

    // Exclude null values.
    if (nullValues && value === null) {
      return;
    }

    // Exclude undefined values.
    if (undefinedValues && value === undefined) {
      return;
    }

    // Append when recursing arrays.
    if (Array.isArray(result)) {
      return result.push(value);
    }

    result[key] = value;
  });
};
