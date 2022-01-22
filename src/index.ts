import './assets/scss/styles.scss';
import Card from './components/card';
import Logger from './utils/logger';
import { ICard } from './types';

import PlainDraggable from './plugins/plain-draggable.min';
import LeaderLine from './plugins/leader-line.min';

export class ChatBotFlowsMaker {
  logger = new Logger();
  container: any;
  cardsObjectList: Card[] = [];
  lines: any[] = [];

  constructor(container: any) {
    this.logger.debug('Init...');
    this.container = container || document.body;
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

    this.connectObjectsByLines();
    this.initDraggableCards();
  };

  connectObjectsByLines = () => {
    for (const cardObject of this.cardsObjectList) {
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

          const line = new LeaderLine(fromEl, toEl, {
            middleLabel: (LeaderLine as any).captionLabel(answer.title),
            lineId: `${cardObject.getAnswerUniqueId(answer)}-${nextCard.uniqueId}`,
          });

          this.lines.push(line);
        }
      }
    }
  };

  initDraggableCards = () => {
    for (const cardObject of this.cardsObjectList) {
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
    for (const line of this.lines) {
      try {
        line.position();
      } catch (e) {
        continue;
      }
    }
  };

  getNextCardObject = (uniqueId: string) => {
    return this.cardsObjectList.find((item) => item.uniqueId === uniqueId);
  };
}
