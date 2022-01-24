import './assets/scss/styles.scss';
import { ICard, ICardType } from './types';
import Card from './components/card';
import cardType from './components/cardType';
import bus from './components/bus';
import cardObjects from './components/cardObjects';
import logger from './utils/logger';
import mouseDrawer from './components/mouseDrawer';

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
    for (const cardObject of cardObjects.items) {
      bus.onDeleteCard(cardObjects.removeCard);
      cardObject.render();
    }

    cardObjects.connectObjectsByLines();
    cardObjects.initDraggableCards();
    this.registerMouseDrawer();
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

  registerMouseDrawer = () => {
    mouseDrawer.init();
    // Redraw lines after mouse event done
    mouseDrawer.setDrawDoneCallback(cardObjects.connectObjectsByLines);
  };
}
