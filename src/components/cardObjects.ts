import logger from 'src/utils/logger';
import Card from './card';
import PlainDraggable from '../plugins/plain-draggable.min';
import LeaderLine from '../plugins/leader-line.min';
import { IAnswer, ILine, INextCard } from 'src/types';

class CardObjects {
  items: Card[] = [];
  lines: ILine = {};

  addCard(item: Card) {
    this.items.push(item);
  }

  removeCard = (uniqueId: string) => {
    logger.log(`Remove card clicked, uniqueId: ${uniqueId}`);
  };

  findByUniqueId = (uniqueId: string) => {
    return this.items.find((item) => item.uniqueId === uniqueId);
  };

  connectObjectsByLines = () => {
    this.removeAllLines();
    for (const cardObject of this.items) {
      for (const answer of cardObject.answers) {
        const fromEl = cardObject.getAnswerNodeEl(answer);
        const nextCards = answer.nextCards || [];

        for (const nextCard of nextCards) {
          const nextCardObject = this.findByUniqueId(nextCard.uniqueId);
          if (!nextCardObject) {
            logger.warn(`Unknown next card uniqueId: ${nextCard.uniqueId}`);
            continue;
          }

          const toEl = nextCardObject.getCardNodeEl(nextCard.nodeIndex);
          if (!toEl) {
            logger.warn('Unknown to card node', nextCard);
            continue;
          }

          const lineId = this.makeLineId(cardObject, answer, nextCard);
          toEl.setAttribute('data-from-card-unique-id', cardObject.uniqueId);
          toEl.setAttribute('data-from-answer-id', answer.id);
          toEl.setAttribute('data-line-id', lineId);

          const line = new LeaderLine(fromEl, toEl, {
            lineId,
            middleLabel: (LeaderLine as any).captionLabel(answer.title),
            endLabel: (LeaderLine as any).pathLabel('×'),
          });

          this.addLine(lineId, line);
        }
      }
    }
  };

  initDraggableCards = () => {
    for (const cardObject of this.items) {
      const fromEl = cardObject.el;
      new PlainDraggable(fromEl, {
        handle: cardObject.moveControlEl,
        autoScroll: true,
        onMove: () => {
          this.rePosition();
        },
        onDragEnd: (evt: any) => {
          cardObject.setLeft(evt.left);
          cardObject.setTop(evt.top);
        },
      });
    }

    // First load re position all line
    this.rePosition();
  };

  addLine = (lineId: string, line: any) => {
    this.lines[lineId] = line;
  };

  rePosition = () => {
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

  makeLineId = (cardObject: Card, answer: IAnswer, nextCard: INextCard) => {
    return `line-${cardObject.uniqueId}-${answer.id}-${nextCard.uniqueId}-${nextCard.nodeIndex}`;
  };
}

export default new CardObjects();
