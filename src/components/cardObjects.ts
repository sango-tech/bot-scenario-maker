import logger from '../utils/logger';
import Card from './card';
import PlainDraggable from '../plugins/plain-draggable.min';
import LeaderLine from '../plugins/leader-line.min';
import { ICardAnswer, ICard, ILine, INextCard } from '../types';
import bus from './bus';

class CardObjects {
  items: Card[] = [];
  lines: ILine = {};

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
    this.triggerChanged();
  };

  removeAllCards() {
    this.items = []
    this.triggerChanged();
  }

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
            startLabel: (LeaderLine as any).captionLabel(answer.totalUsers),
            middleLabel: (LeaderLine as any).captionLabel(answer.title),
            endLabel: (LeaderLine as any).pathLabel('×'),
          });

          this.addLine(lineId, line);
          this.registerLineRemoveEvent(lineId, cardObject.uniqueId, answer.id, nextCard.uniqueId);
          this.registerLineHoverEvent(lineId)
          this.updatePostionStartLabel(lineId)
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

  registerLineHoverEvent = (lineId: string) => {
    const lineEl = document.getElementById(lineId);
    const that = this;

    lineEl?.addEventListener('mouseover', function () {
      const currentLine = that.lines[lineId];
      currentLine.color= "#266ff8"
    });
    lineEl?.addEventListener('mouseout', function () {
      const currentLine = that.lines[lineId];
      currentLine.color= "coral"
    });
  };

  updatePostionStartLabel = (lineId: string) => {
    const svg = document.getElementById(lineId)
    const texts = svg?.querySelectorAll('text:not(.leader-line-end-label)')
    if (texts && texts.length >1){
      const middleLabel = texts[1] as SVGTextElement
      const startLabel = texts[0] as SVGTextElement
      const y = (parseInt(middleLabel.getAttribute("y")??"0") + 20).toString() + "px"
      const x = (parseInt(middleLabel.getAttribute("x")??"0")).toString() + "px"
      startLabel.setAttribute("y", y)
      startLabel.setAttribute("x", x)
    }
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

  makeLineId = (cardObject: Card, answer: ICardAnswer, nextCard: INextCard) => {
    return `line-${cardObject.uniqueId}-${answer.id}-${nextCard.uniqueId}-${nextCard.nodeIndex}`;
  };

  findByUniqueId = (uniqueId: string) => {
    return this.items.find((item) => item.uniqueId === uniqueId);
  };
}

export default new CardObjects();
