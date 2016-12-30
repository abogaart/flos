export function asArray(value) {
  if (value) {
    return Array.isArray(value) ? value : [value];
  }
  return [];
}

export function nonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

export default {
  asArray,
  nonEmptyArray
};
