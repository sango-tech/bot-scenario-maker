import './assets/scss/styles.scss';
import { ICard, ICardType } from './types';
import Card from './components/card';
import cardType from './components/cardType';
import bus from './components/bus';
import cardObjects from './components/cardObjects';
import logger from './utils/logger';
import mouseDrawer from './components/mouseDrawer';
import renderer from './components/renderer';

export class ChatBotFlowsMaker {
  container: any;

  constructor(container: any) {
    logger.debug('Init...');
    this.container = container || document.body;
    mouseDrawer.setContainer(container);
    return this;
  }

  addCard = (item: ICard) => {
    logger.log('Added card', item);
    const card = new Card(this.container, item);
    cardObjects.addCard(card);
    return this;
  };

  render = () => {
    renderer.render();
    bus.onDeleteCard(cardObjects.removeCard);
    cardObjects.onChange(() => {
      renderer.render();
    });
  };

  onCardEdit = (callback: Function) => {
    bus.onCardEdit(callback);
  };

  onAddNextClicked = (callback: Function) => {
    bus.onAddNext(callback);
  };

  setCardTypes = (cardTypes: ICardType[]) => {
    cardType.setCardTypes(cardTypes);
  };
}
