export const uniqBy = (arr: any[], key: string) => {
  const set = new Set();
  return arr.filter((o) => !set.has(o[key]) && set.add(o[key]));
};

export const debouce = (func: Function, timer: number) => {
  setTimeout(func, timer);
};

export const randomString = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  const n = 10;
  for (let i = 0; i < n; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
