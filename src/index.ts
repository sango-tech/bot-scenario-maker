import './assets/scss/styles.scss';
import Card from './components/card';
import { ICard } from './types';
import Logger from './utils/logger';

export class ChatBotFlowsMaker {
  logger = new Logger();
  container: any;
  cardsObjectList: Card[] = [];

  constructor(container: any) {
    this.logger.debug('Init...');
    this.container = container || document.body;
    console.log(this, 'this');
    return this;
  }

  addCard = (item: ICard) => {
    this.logger.log('Added card', item);
    const card = new Card(this.container, item);
    this.cardsObjectList.push(card);
    return this;
  };

  render = () => {
    for (let i = 0; i < this.cardsObjectList.length; i++) {
      const cardObj = this.cardsObjectList[i];
      cardObj.render();
    }
  };
}
