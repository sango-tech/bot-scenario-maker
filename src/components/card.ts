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

  get uniqueId() {
    return this.card.uniqueId;
  }

  get elementId() {
    return this.card.uniqueId;
  }

  get moveControlElementId() {
    return `movearea-${this.card.uniqueId}`;
  }

  get el() {
    return document.getElementById(this.card.uniqueId);
  }

  get moveControlEl() {
    return document.getElementById(this.moveControlElementId);
  }

  get answers() {
    return this.card.answers || [];
  }

  getAnswerNodeUniqueId(answer: IAnswer) {
    return `answer-node-${this.card.uniqueId}-${answer.id}`;
  }

  getCardNodeId(index: number) {
    return `card-node-${this.card.uniqueId}-${index}`;
  }

  getCardNodeEl(index: number) {
    return document.getElementById(this.getCardNodeId(index));
  }

  getAnswerNodeEl(answer: IAnswer) {
    return document.getElementById(this.getAnswerNodeUniqueId(answer));
  }

  setLeft(num: number) {
    this.card.left = num;
  }

  setTop(num: number) {
    this.card.top = num;
  }

  async render() {
    this.logger.log('Card:render');
    this.renderHTML();
  }

  renderHTML() {
    const html = `
    <div class="sgbmk__card" id="${this.elementId}" style="left: ${this.card.left}px; top: ${this.card.top}px;">
      <div class="sgbmk__card__title" id="${this.moveControlElementId}">
        <span class="sgbmk__card__title__badge">${this.card.titleBadge}</span>
        ${this.card.title}
      </div>
      <div class="sgbmk__card__answers">
        ${this.renderAnswers()}
      </div>
      ${this.renderCardNodes()}
    </div>
    `;

    this.container.innerHTML += html;
  }

  renderAnswers() {
    let html = '';
    if (!this.card.answers || !this.card.answers.length) {
      return html;
    }

    for (let i = 0; i < this.card.answers.length; i++) {
      const answer = this.card.answers[i];
      html += `
        <div class="sgbmk__card__answers__item">
          <div class="sgbmk__card__answers__item__title sgbmk-ellipsis">${answer.title}</div>
          <div class="sgbmk__card__answers__item__node sgbmk-node"
            data-card-unique-id="${this.card.uniqueId}"
            data-answer-id="${answer.id}"
            id="${this.getAnswerNodeUniqueId(answer)}">
          </div>
        </div>
      `;
    }

    return html;
  }

  renderCardNodes() {
    let html = '';
    for (let i = 0; i < 8; i++) {
      html += `<span class="sgbmk__card__node sgbmk__card__node--${i} sgbmk-node"
      id="${this.getCardNodeId(i)}"></span>`;
    }

    return html;
  }
}
