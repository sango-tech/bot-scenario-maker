import logger from 'src/utils/logger';
import Card from './card';
import PlainDraggable from '../plugins/plain-draggable.min';
import LeaderLine from '../plugins/leader-line.min';
import { IAnswer, ICard, ILine, INextCard } from 'src/types';
import bus from './bus';

class CardObjects {
  items: Card[] = [];
  lines: ILine = {};
  onChangeCallback!: Function;

  addCard(item: Card) {
    this.items.push(item);
  }

  updateCard(uniqueId: string, data: any) {
    this.items.map((item) => {
      if (item.uniqueId === uniqueId) {
        item = { ...item, ...data };
      }

      return item;
    });

    this.triggerChanged();
  }

  removeCard = (uniqueId: string) => {
    logger.log(`Remove card clicked, uniqueId: ${uniqueId}`);
    this.items = this.items.filter((item) => item.uniqueId !== uniqueId);
    if (this.onChangeCallback) {
      const newVal = this.getValue();
      this.onChangeCallback(newVal);
      // Emit to client
      bus.callbackOnChange(newVal);
    }
  };

  getValue = () => {
    const newValue: ICard[] = [];
    for (const cardObject of this.items) {
      const card = cardObject.card;
      const answers = card.answers;
      for (var i = 0; i < answers.length; i++) {
        const answer = answers[i];
        answers[i].nextCards =
          answer.nextCards?.filter((nextCard) => {
            // Remove all next card if that card not exists
            return this.items.find((item) => item.uniqueId === nextCard.uniqueId);
          }) || [];
      }

      card.answers = answers;
      newValue.push(card);
    }

    return newValue;
  };

  onChange = (callback: Function) => {
    this.onChangeCallback = callback;
  };

  triggerChanged = () => {
    // Emit to client
    bus.callbackOnChange(this.getValue());
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
          this.registerLineRemoveEvent(lineId, cardObject.uniqueId, answer.id, nextCard.uniqueId);
        }
      }
    }
  };

  initDraggableCards = () => {
    for (const cardObject of this.items) {
      const moveEL = cardObject.el;
      new PlainDraggable(moveEL, {
        handle: cardObject.moveControlEl,
        autoScroll: true,
        onMove: () => {
          this.rePosition();
        },
        onDragEnd: (evt: any) => {
          cardObject.setPos(evt.left, evt.top);
          this.triggerChanged();
        },
      });
    }

    // First load re position all line
    this.rePosition();
  };

  registerLineRemoveEvent = (lineId: string, uniqueId: string, answerId: string, nextUniqueId: string) => {
    const lineEl = document.getElementById(lineId);
    const that = this;
    lineEl?.querySelector('.leader-line-end-label')?.addEventListener('click', function () {
      that.lines[lineId].remove();
      that.items.map((item) => {
        if (item.uniqueId === uniqueId) {
          item.answers?.map((answer) => {
            if (answer.id === answerId) {
              answer.nextCards = answer.nextCards.filter((nextCard) => nextCard.uniqueId !== nextUniqueId);
            }

            return answer;
          });
        }

        return item;
      });

      that.triggerChanged();
    });
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

  findByUniqueId = (uniqueId: string) => {
    return this.items.find((item) => item.uniqueId === uniqueId);
  };
}

export default new CardObjects();
