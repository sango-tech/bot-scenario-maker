import { constant } from './constant';
import SangoDebug from './debug';

export default class Logger {
  private debugger = new SangoDebug();

  public log(type: string, message: any = '') {
    console.log(`%c[SANGO] ${type}`, constant.console_color, message);
  }

  public warn(type: string, message: any = '') {
    console.warn(`%c[SANGO WARNING] ${type}`, constant.console_color_warning, message);
  }

  public debug(value: any) {
    if (!this.debugger.isDebugOn) {
      return;
    }

    console.debug(`%c[SANGO DEBUG]`, constant.console_color_warning, value);
  }
}
