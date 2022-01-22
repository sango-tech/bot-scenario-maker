export default class SangoHelper {
  public get getProtocol() {
    return 'https:' === document.location.protocol ? 'https://' : 'http://';
  }

  public get now() {
    return new Date();
  }
}
