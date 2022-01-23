import './assets/scss/styles.scss';
import Card from './components/card';
import Logger from './utils/logger';
import { IAnswer, ICard, ICardType, ILine, INextCard } from './types';

import PlainDraggable from './plugins/plain-draggable.min';
import LeaderLine from './plugins/leader-line.min';
import MouseDrawer from './components/mouseDrawer';
import cardType from './components/cardType';
import bus from './components/bus';

export class ChatBotFlowsMaker {
  logger = new Logger();
  container: any;
  cardObjects: Card[] = [];
  lines: ILine = {};
  mouseDrawer!: MouseDrawer;
  callbackCardEdit!: Function;

  constructor(container: any) {
    this.logger.debug('Init...');
    this.container = container || document.body;
    this.mouseDrawer = new MouseDrawer(this.container);
    return this;
  }

  addCard = (item: ICard) => {
    this.logger.log('Added card', item);
    const card = new Card(this.container, item);
    this.cardObjects.push(card);

    this.mouseDrawer.setCardObjects(this.cardObjects);
    return this;
  };

  render = () => {
    for (let i = 0; i < this.cardObjects.length; i++) {
      const cardObj = this.cardObjects[i];
      bus.onDeleteCard(this.removeCard);

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
          if (!toEl) {
            this.logger.warn('Unknown to card node', nextCard);
            continue;
          }

          const lineId = this.getLineId(cardObject, answer, nextCard);
          toEl.setAttribute('data-from-card-unique-id', cardObject.uniqueId);
          toEl.setAttribute('data-from-answer-id', answer.id);
          toEl.setAttribute('data-line-id', lineId);

          const line = new LeaderLine(fromEl, toEl, {
            lineId,
            middleLabel: (LeaderLine as any).captionLabel(answer.title),
            endLabel: (LeaderLine as any).pathLabel('×'),
          });

          this.lines[lineId] = line;
        }
      }
    }

    this.mouseDrawer.setLines(this.lines);
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
    this.mouseDrawer.setLines(this.lines);
  };

  removeCard = (uniqueId: string) => {
    this.logger.log(`Remove card clicked, uniqueId: ${uniqueId}`);
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
    this.mouseDrawer.init();
    this.mouseDrawer.setDrawDoneCallback(this.connectObjectsByLines);
  };

  getNextCardObject = (uniqueId: string) => {
    return this.cardObjects.find((item) => item.uniqueId === uniqueId);
  };

  getLineId = (cardObject: Card, answer: IAnswer, nextCard: INextCard) => {
    return `line-${cardObject.uniqueId}-${answer.id}-${nextCard.uniqueId}-${nextCard.nodeIndex}`;
  };
}
