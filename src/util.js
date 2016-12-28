export function asArray(pattern) {
  if (pattern) {
    return Array.isArray(pattern) ? pattern : [pattern];
  }
  return [];
}

export default {
  asArray
};
