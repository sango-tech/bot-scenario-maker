export default class SangoDebug {
  private debugMode: string = 'sango_debug_mode';
  private isDisplayedDebugOnMsg: boolean = false;

  get isDebugOn() {
    return !!this.getLocalStore(this.debugMode);
  }

  public getLocalStore(key: string) {
    if (!localStorage) {
      return '';
    }

    const value = localStorage.getItem(key);
    if (value && value !== '') {
      if (!this.isDisplayedDebugOnMsg) {
        console.log(`Debug mode ON: ${key} -> ${value}`);
        this.isDisplayedDebugOnMsg = true;
      }

      return value;
    }

    return '';
  }
}
