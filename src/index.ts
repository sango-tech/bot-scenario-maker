import './assets/scss/styles.scss';
import Card from './components/card';
import Logger from './utils/logger';
import { IAnswer, ICard, INextCard } from './types';

import PlainDraggable from './plugins/plain-draggable.min';
import LeaderLine from './plugins/leader-line.min';
import MouseDrawer from './components/mouseDrawer';

export class ChatBotFlowsMaker {
  logger = new Logger();
  container: any;
  cardObjects: Card[] = [];
  lines: Record<string, any> = {};

  constructor(container: any) {
    this.logger.debug('Init...');
    this.container = container || document.body;
    return this;
  }

  addCard = (item: ICard) => {
    this.logger.log('Added card', item);
    const card = new Card(this.container, item);
    this.cardObjects.push(card);

    return this;
  };

  render = () => {
    for (let i = 0; i < this.cardObjects.length; i++) {
      const cardObj = this.cardObjects[i];
      cardObj.render();
    }

    this.connectObjectsByLines();
    this.initDraggableCards();
    this.registerMouseDrawer();
  };

  connectObjectsByLines = () => {
    this.removeAllLines();
    for (const cardObject of this.cardObjects) {
      for (const answer of cardObject.answers) {
        const fromEl = cardObject.getAnswerNodeEl(answer);
        const nextCards = answer.nextCards || [];

        for (const nextCard of nextCards) {
          const nextCardObject = this.getNextCardObject(nextCard.uniqueId);
          if (!nextCardObject) {
            this.logger.warn(`Unknown next card uniqueId: ${nextCard.uniqueId}`);
            continue;
          }

          const toEl = nextCardObject.getCardNodeEl(nextCard.nodeIndex);
          const lineId = this.getLineId(cardObject, answer, nextCard);

          const line = new LeaderLine(fromEl, toEl, {
            lineId,
            middleLabel: (LeaderLine as any).captionLabel(answer.title),
          });

          this.lines[lineId] = line;
        }
      }
    }
  };

  initDraggableCards = () => {
    for (const cardObject of this.cardObjects) {
      const fromEl = cardObject.el;
      new PlainDraggable(fromEl, {
        handle: cardObject.moveControlEl,
        autoScroll: true,
        onMove: () => {
          this.reDrawLinePosition();
        },
        onDragEnd: (evt: any) => {
          cardObject.setLeft(evt.left);
          cardObject.setTop(evt.top);
        },
      });
    }

    // First load re position all line
    this.reDrawLinePosition();
  };

  reDrawLinePosition = () => {
    for (const line of Object.values(this.lines)) {
      try {
        line.position();
      } catch (e) {
        continue;
      }
    }
  };

  removeAllLines = () => {
    for (const line of Object.values(this.lines)) {
      try {
        line.remove();
      } catch (e) {
        continue;
      }
    }

    this.lines = {};
  };

  registerMouseDrawer = () => {
    const mouseDrawer = new MouseDrawer(this.container, this.cardObjects);
    mouseDrawer.init();
    mouseDrawer.setDrawDoneCallback(this.connectObjectsByLines);
  };

  getNextCardObject = (uniqueId: string) => {
    return this.cardObjects.find((item) => item.uniqueId === uniqueId);
  };

  getLineId = (cardObject: Card, answer: IAnswer, nextCard: INextCard) => {
    return `line-${cardObject.uniqueId}-${answer.id}-${nextCard.uniqueId}-${nextCard.nodeIndex}`;
  };
}
