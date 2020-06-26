export function groupBy<T, K = string>(
  iterator: (item: T) => K,
): (collection: T[]) => Array<[K, T[]]> {
  return (collection: T[]) => {
    const grouped = collection
      .map((item) => {
        const key = iterator(item);

        return { key, item };
      })
      .reduce((hash, { key, item }) => {
        let group = hash.get(key);
        if (!group) {
          group = [];
          hash.set(key, group);
        }
        group.push(item);
        return hash;
      }, new Map<K, T[]>());

    return Array.from(grouped.entries());
  };
}

export function sortBy<T>(
  iterator: (item: T) => any,
  descending = false,
): (collection: T[]) => T[] {
  return (collection: T[]) => collection.sort((a, b) => {
    const left = iterator(a);
    const right = iterator(b);

    if (left > right) {
      return descending ? -1 : 1;
    }
    if (left < right) {
      return descending ? 1 : -1;
    }
    return 0;
  });
}

export function pipe<T extends any[], R>(
  fn: (...args: T) => R,
  ...fns: Array<(a: R) => R>
) {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: R) => nextFn(prevFn(value)),
    (value) => value,
  );
  return (...args: T) => piped(fn(...args));
}
