export default class SangoHelper {
  get getProtocol() {
    return 'https:' === document.location.protocol ? 'https://' : 'http://';
  }

  get now() {
    return new Date();
  }
}

export const uniqBy = (arr: any[], key: string) => {
  const set = new Set();
  return arr.filter((o) => !set.has(o[key]) && set.add(o[key]));
};

export const debouce = (func: Function, timer: number) => {
  setTimeout(func, timer);
};
