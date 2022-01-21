import './assets/scss/styles.scss';
import { IQuestion } from './types';
import Logger from './utils/logger';

export class ChatBotFlowsMaker {
  logger = new Logger();

  constructor() {
    this.logger.debug('Init...');
  }

  addItem(item: IQuestion) {
    this.logger.log('Added item', item);
  }
}

const context = window as any;
const instanceName = 'ChatBotFlowsMaker';
if (!context[instanceName]) {
  context[instanceName] = ChatBotFlowsMaker;
}
