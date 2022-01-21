import { IAnswer, ICard } from 'src/types';
import Logger from 'src/utils/logger';

export default class Card {
  logger = new Logger();
  card!: ICard;
  container!: any;

  constructor(container: any, card: ICard) {
    this.container = container;
    this.card = card;
  }

  get elementId() {
    return this.card.uniqueId;
  }

  async render() {
    this.logger.log('Card:render');
    this.renderHTML();
  }

  renderHTML() {
    const html = `
    <div class="sgbmk__card" id="${this.elementId}">
      <div class="sgbmk__card__title">
        <span class="sgbmk__card__title__badge">${this.card.titleBadge}</span>
        ${this.card.title}
      </div>
      <div class="sgbmk__card__answers">
        ${this.renderAnswers()}
      </div>
    </div>
    `;

    this.container.innerHTML = html;
  }

  renderAnswers() {
    let html = '';
    if (!this.card.answers || !this.card.answers.length) {
      return html;
    }

    for (let i = 0; i < this.card.answers.length; i++) {
      const answer = this.card.answers[i];
      html += `
        <div class="sgbmk__card__answers__item" id="${this.getCardAnswerElementId(answer)}">
          ${answer.title}
        </div>
      `;
    }

    return html;
  }

  getCardAnswerElementId(answer: IAnswer) {
    return `answer-${this.card.uniqueId}-${answer.id}`;
  }
}
