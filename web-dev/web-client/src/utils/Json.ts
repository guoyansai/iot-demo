export function toStr(obj: any) {
  const cache: any = [];
  return JSON.stringify(obj, (_key, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        return;
      }
      cache.push(value);
    }
    return value;
  });
}
