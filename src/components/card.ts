import { ICard, ICardAnswer } from '../types';
import { debouce } from '../utils/helper';
import bus from './bus';
import cardType from './cardType';

export default class Card {
  card!: ICard;
  container!: any;
  isReport: boolean;
  btnNext: HTMLButtonElement;
  btnAdd: HTMLButtonElement;
  btnEdit: HTMLButtonElement;
  btnDelete: HTMLButtonElement;
  iconStart: HTMLElement;
  iconMessage: HTMLElement;
  iconQuestion: HTMLElement;
  iconGoal: HTMLElement;
  directionType = 1;

  constructor(
    container: any,
    card: ICard,
    isReport: boolean = false,
    btnNext: HTMLButtonElement,
    btnAdd: HTMLButtonElement,
    btnEdit: HTMLButtonElement,
    btnDelete: HTMLButtonElement,
    iconStart: HTMLElement,
    iconMessage: HTMLElement,
    iconQuestion: HTMLElement,
    iconGoal: HTMLElement,
  ) {
    this.container = container;
    this.card = card;
    this.isReport = isReport;
    this.btnNext = btnNext;
    this.btnAdd = btnAdd;
    this.btnEdit = btnEdit;
    this.btnDelete = btnDelete;
    this.iconStart = iconStart;
    this.iconMessage = iconMessage;
    this.iconQuestion = iconQuestion;
    this.iconGoal = iconGoal;
  }

  get uniqueId() {
    return this.card.uniqueId;
  }

  get nextBtnCls() {
    return `sgbmk-next-button-${this.uniqueId}`;
  }

  get elementId() {
    return this.card.uniqueId;
  }

  get moveControlElementId() {
    return `movearea-${this.card.uniqueId}`;
  }

  get deleteButtonId() {
    return `card-delete-btn-${this.card.uniqueId}`;
  }

  get addNextButtonId() {
    return `card-add-next-btn-${this.card.uniqueId}`;
  }

  get editButtonId() {
    return `card-edit-btn-${this.card.uniqueId}`;
  }

  get el() {
    return document.getElementById(this.card.uniqueId);
  }

  get moveControlEl() {
    return document.getElementById(this.moveControlElementId);
  }

  get deleteButtonEl() {
    return document.getElementById(this.deleteButtonId);
  }

  get editButtonEl() {
    return document.getElementById(this.editButtonId);
  }

  get addNextButtonEl() {
    return document.getElementById(this.addNextButtonId);
  }

  get answers() {
    return this.card.answers || [];
  }

  get cardTypes() {
    return cardType.cardTypes;
  }

  get directionTypeCls() {
    if (this.directionType == 0) {
      return 'horizontal';
    } else {
      if (this.card.cardType == 'message' || this.card.cardType == 'start') {
        return '';
      }
      return 'vertical';
    }
  }

  getAnswerNodeUniqueId(answer: ICardAnswer) {
    return `answer-node-${this.card.uniqueId}-${answer.id}`;
  }

  getCardNodeId(index: number) {
    return `card-node-${this.card.uniqueId}-${index}`;
  }

  getCardNodeEl(index: number) {
    return document.getElementById(this.getCardNodeId(index));
  }

  getAnswerNodeEl(answer: ICardAnswer) {
    return document.getElementById(this.getAnswerNodeUniqueId(answer));
  }

  setPos(left: number, top: number) {
    this.card.left = left;
    this.card.top = top;
  }

  setTop(num: number) {
    this.card.top = num;
  }

  async render() {
    this.renderHTML();
    this.registerDeleteCardEvent();
    this.registerEditCardEvent();
    this.registerAddCardEvent();
  }

  renderHTML() {
    let bgTitle = '';
    let icon = ''
    if (this.card.cardType == 'start') {
      bgTitle = 'start-card';
      icon = this.renderStartIcon();
    } else if (this.card.cardType == 'message') {
      bgTitle = 'message-card';
      icon = this.renderMessageIcon();
    } else if (this.card.cardType == 'goal') {
      bgTitle = 'goal-card';
      icon = this.renderGoalIcon();
    } else {
      bgTitle = 'question-card';
      icon = this.renderQuestionIcon();
    }
    let flex = '';
    if (this.isReport) {
      flex = 'display-flex';
    }

    let htmlAnswer = '';
    if (this.directionType == 1) {
      htmlAnswer = this.renderAnswersVertical();
    } else {
      htmlAnswer = this.renderAnswersHorizontal();
    }

    const html = `
      <div class="sgbmk__card__title ${bgTitle} ${flex}" id="${this.moveControlElementId}">
       <div class="sgbmk__card__title__header">
         <div class="sgbmk__card__title__badge">
          ${this.card.titleBadge}
         </div>
         <div class="sgbmk__card__actions">
            ${this.renderDeleteButton()}
            ${this.renderEditButton()}
            ${this.renderAddNextButton()}
          </div>
       </div>
       <div class="sgbmk__card__title__footer">
        ${icon}
        ${this.card.title.length > 20 ? this.card.title.slice(0, 20) + '...' : this.card.title }
       </div>
      </div>

      <div class="sgbmk__card__answers sgbmk__card__answers__${this.directionTypeCls}">
        ${htmlAnswer}
        ${this.renderTotalUsers()}
      </div>

      ${this.renderCardNodes()}
    `;

    const cardEl = document.createElement('div');
    cardEl.classList.add('sgbmk__card');
    cardEl.id = this.elementId;
    cardEl.innerHTML = html;
    cardEl.style.left = `${this.card.left}px`;
    cardEl.style.top = `${this.card.top}px`;

    this.container.appendChild(cardEl);
  }

  getcssRedColorNotSelected(id: string) {
    let css = '';
    if (id == 'any') {
      return css;
    }

    let isAnswer = false;
    for (let i = 0; i < this.card.answers.length; i++) {
      const answer = this.card.answers[i];
      if (answer.nextCards.length > 0 && answer.id == 'any') {
        return css;
      }

      if (answer.nextCards.length > 0) {
        isAnswer = true;
        break;
      }
    }

    if (!isAnswer) {
      return css;
    }

    for (let i = 0; i < this.card.answers.length; i++) {
      const answer = this.card.answers[i];
      if (answer.nextCards.length <= 0 && answer.id == id) {
        css = 'sgbmk-node-not-select';
      }
    }

    return css;
  }

  renderAnswersHorizontal() {
    let html = '';
    if (!this.card.answers || !this.card.answers.length) {
      return html;
    }

    const any = this.card.answers[0];
    const anyCss = this.getcssRedColorNotSelected(any.id);
    html += `
      <div class="sgbmk__card__answers__item__any sgbmk__card__answers__item__${this.directionTypeCls}">
        <div class="sgbmk__card__answers__item__group">
          <div class="sgbmk__card__answers__item__any-title sgbmk-ellipsis"
          data-card-unique-id="${this.card.uniqueId}"
          data-answer-id="${any.id}">${any.title}</div>
          <div>
    `;

    for (let i = 1; i < this.card.answers.length; i++) {
      const answer = this.card.answers[i];
      const css = this.getcssRedColorNotSelected(answer.id);
      html += `
        <div class="sgbmk__card__answers__item sgbmk__card__answers__item__${this.directionTypeCls}">
          <div class="sgbmk__card__answers__item__title sgbmk-ellipsis"
          data-card-unique-id="${this.card.uniqueId}"
          data-answer-id="${answer.id}">${answer.title}</div>
          <div class="sgbmk__card__answers__item__node sgbmk-node sgbmk-node__${this.directionTypeCls} ${css}"
          data-card-unique-id="${this.card.uniqueId}"
          data-answer-id="${answer.id}"
          id="${this.getAnswerNodeUniqueId(answer)}">
          </div>
        </div>
      `;
    }

    html += `
          </div>
        </div>
        <div class="sgbmk__card__answers__item__any-node">
          <div class="sgbmk__card__answers__item__node sgbmk-node sgbmk-node__${this.directionTypeCls} ${anyCss}"
            data-card-unique-id="${this.card.uniqueId}"
            data-answer-id="${any.id}"
            id="${this.getAnswerNodeUniqueId(any)}">
          </div>
        </div>
      </div>
    `;

    return html;
  }

  renderAnswersVertical() {
    let html = '';
    if (!this.card.answers || !this.card.answers.length) {
      return html;
    }

    for (let i = 0; i < this.card.answers.length; i++) {
      const answer = this.card.answers[i];
      const css = this.getcssRedColorNotSelected(answer.id);
      html += `
        <div class="sgbmk__card__answers__item sgbmk__card__answers__item__${this.directionTypeCls}">
          <div class="sgbmk__card__answers__item__title sgbmk-ellipsis"
          data-card-unique-id="${this.card.uniqueId}"
          data-answer-id="${answer.id}">${answer.title}</div>
          <div class="sgbmk__card__answers__item__node sgbmk-node sgbmk-node__${this.directionTypeCls} ${css}"
          data-card-unique-id="${this.card.uniqueId}"
          data-answer-id="${answer.id}"
          id="${this.getAnswerNodeUniqueId(answer)}">
          </div>
        </div>
      `;
    }

    return html;
  }

  renderTotalUsers() {
    let html = '';
    if (!this.isReport) {
      return html;
    }
    html += `
        <div class="sgbmk__card__answers__item sgbmk-total-user">
          <div class="sgbmk__card__answers__item__title sgbmk-ellipsis">${this.card.totalUsers} ${this.card.labelTotalUsers}</div>
        </div>
      `;

    return html;
  }

  renderCardNodes() {
    let html = '';
    for (let i = 0; i < 8; i++) {
      html += `<span class="sgbmk__card__node sgbmk__card__node--${i} sgbmk-node"
      id="${this.getCardNodeId(i)}"
      data-card-unique-id="${this.card.uniqueId}"
      data-node-index="${i}"
      ></span>`;
    }

    return html;
  }

  registerAddCardEvent = () => {
    const that = this;
    debouce(() => {
      this.addNextButtonEl?.addEventListener('click', function () {
        if (bus.callbackOnAddCard) {
          bus.callbackOnAddCard(that.uniqueId);
        }
      });
    }, 500);
  };

  registerDeleteCardEvent = () => {
    const that = this;
    debouce(() => {
      this.deleteButtonEl?.addEventListener('click', function () {
        if (bus.callbackOnDeleteCard) {
          bus.callbackOnDeleteCard(that.uniqueId);
        }
      });
    }, 500);
  };

  registerEditCardEvent = () => {
    const that = this;
    debouce(() => {
      this.editButtonEl?.addEventListener('click', function () {
        if (bus.callbackOnEditCard) {
          bus.callbackOnEditCard(that.uniqueId);
        }
      });
    }, 500);
  };

  renderEditButton() {
    if (this.isReport) {
      return '';
    }
    const btn = this.btnEdit.cloneNode(true) as HTMLButtonElement;
    return `
      <a id="${this.editButtonId}" class="sgbmk-btn" data-unique-id="${this.uniqueId}">
      ${btn.outerHTML}
      </a>
    `;
  }

  renderDeleteButton() {
    if (this.isReport) {
      return '';
    }
    const btn = this.btnDelete.cloneNode(true) as HTMLButtonElement;
    return `
      <a id="${this.deleteButtonId}" class="sgbmk-btn" data-unique-id="${this.uniqueId}">
      ${btn.outerHTML}
      </a>
    `;
  }

  renderStartIcon() {
    const icon = this.iconStart.cloneNode(true) as HTMLElement;
    return `
      <div class="sgbmk-icon">${icon.outerHTML}</div>
    `;
  }

  renderMessageIcon() {
    const icon = this.iconMessage.cloneNode(true) as HTMLElement;
    return `
      <div class="sgbmk-icon">${icon.outerHTML}</div>
    `;
  }

  renderQuestionIcon() {
    const icon = this.iconQuestion.cloneNode(true) as HTMLElement;
    return `
      <div class="sgbmk-icon">${icon.outerHTML}</div>
    `;
  }

  renderGoalIcon() {
    const icon = this.iconGoal.cloneNode(true) as HTMLElement;
    return `
      <div class="sgbmk-icon">${icon.outerHTML}</div>
    `;
  }

  renderAddNextButton() {
    if (!this.cardTypes.length) {
      return '';
    }

    if (this.isReport) {
      return '';
    }

    const btn = this.btnAdd.cloneNode(true) as HTMLButtonElement;

    return `
      <a id="${this.addNextButtonId}" class="sgbmk-btn sgbmk-btn-add" data-unique-id="${this.uniqueId}">
        ${btn.outerHTML}
      </a>
    `;
  }
}
