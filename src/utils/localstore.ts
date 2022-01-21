export default class SangoLocalstore {
  private namespace: string = 'hakoform';

  public makeKey(key: string) {
    return `${this.namespace}-${key}`;
  }

  public setItem(key: string, value: any) {
    return localStorage.setItem(this.makeKey(key), value);
  }

  public getItem(key: string) {
    return localStorage.getItem(this.makeKey(key));
  }

  public removeItem(key: string) {
    return localStorage.removeItem(this.makeKey(key));
  }
}
