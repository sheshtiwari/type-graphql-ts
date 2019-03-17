export function unique<T>(arr: T[], byKey?: keyof T): T[] {
  return arr.filter((item, index, self) => {
    return (
      index ===
      self.findIndex(i => {
        if (byKey === undefined) {
          return i === item;
        } else {
          return i[byKey] === item[byKey];
        }
      })
    );
  });
}
