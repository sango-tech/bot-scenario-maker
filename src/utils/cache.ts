export default class SangoCache {
  private namespace!: string;

  constructor(namespace: string = 'hako-form-order') {
    this.namespace = namespace;
    if (!(window as any)[namespace]) {
      (window as any)[namespace] = {};
    }
  }

  public set(key: string, value: any) {
    if (!key) {
      return;
    }

    (window as any)[this.namespace][key] = value;
  }

  public get(key: string) {
    if (!key) {
      return
    }

    return (window as any)[this.namespace][key];
  }
}
