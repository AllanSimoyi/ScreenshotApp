export function flattenArrays<T> (pages: T[][]) {
  return pages.reduce((acc, page) => {
    return [...acc, ...page];
  }, [] as T[]);
}