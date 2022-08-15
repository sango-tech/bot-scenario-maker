import { ICard, ICardAnswer } from '../types';
import { debouce } from '../utils/helper';
import logger from '../utils/logger';
import bus from './bus';
import cardType from './cardType';

export default class Card {
  card!: ICard;
  container!: any;
  isReport:boolean
  btnNext:HTMLButtonElement
  btnAdd:HTMLButtonElement
  btnEdit:HTMLButtonElement
  btnDelete:HTMLButtonElement
  directionType = 1

  constructor(container: any, card: ICard, isReport:boolean= false, btnNext: HTMLButtonElement
    , btnAdd: HTMLButtonElement
    , btnEdit: HTMLButtonElement
    , btnDelete: HTMLButtonElement) {
    this.container = container;
    this.card = card;
    this.isReport = isReport
    this.btnNext = btnNext
    this.btnAdd = btnAdd
    this.btnEdit = btnEdit
    this.btnDelete = btnDelete
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
    if (this.directionType == 0){
      return "horizontal"
    }
    else{
      if(this.card.cardType == "message"){
        return ""
      }
      return "vertical"
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
    this.registerAddCardEvent()
  }

  renderHTML() {
    let bgTitle = ""
    if(this.card.cardType  == "message"){
      bgTitle ="message-card"
    }
    else if (this.card.cardType == "goal"){
      bgTitle ="goal-card"
    }
    else{
      bgTitle = "question-card"
    }
    let flex = ""
    if(this.isReport){
      flex ="display-flex"
    }
    const html = `
      <div class="sgbmk__card__title ${bgTitle} ${flex}" id="${this.moveControlElementId}">
       <div class="sgbmk__card__title__header"> <span class="sgbmk__card__title__badge">${this.card.titleBadge}</span>
       ${this.card.title}<br>
       ${this.card.displayId}
       </div>
        <div class="sgbmk__card__actions">
        ${this.renderDeleteButton()}
        ${this.renderEditButton()}
        ${this.renderAddNextButton()}
      </div>
      </div>

      <div class="sgbmk__card__answers sgbmk__card__answers__${this.directionTypeCls}">
        ${this.renderAnswers()}
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

  getcssRedColorNotSelected(id:string){
    let css = ""
    if (id == "any"){
      return css
    }

    let isAnswer = false
    for (let i = 0; i < this.card.answers.length; i++) {
      const answer = this.card.answers[i];
      if(answer.nextCards.length > 0 && answer.id == "any"){
        return css
      }

      if(answer.nextCards.length > 0){
        isAnswer = true
        break
      }
    }

    if(!isAnswer){
      return css
    }

    for (let i = 0; i < this.card.answers.length; i++) {
      const answer = this.card.answers[i];
      if(answer.nextCards.length <= 0 && answer.id == id){
        css = "sgbmk-node-not-select"
      }
    }

     return css
  }

  renderAnswers() {
    let html = '';
    if (!this.card.answers || !this.card.answers.length) {
      return html;
    }

    for (let i = 0; i < this.card.answers.length; i++) {
      const answer = this.card.answers[i];
      const css = this.getcssRedColorNotSelected(answer.id)
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
    if(!this.isReport)
    {
      return html;
    }
    html += `
        <div class="sgbmk__card__answers__item sgbmk-total-user">
          <div class="sgbmk__card__answers__item__title sgbmk-ellipsis">${this.card.totalUsers} users</div>
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
    if(this.isReport)
    {
      return '';
    }
    const btn = this.btnEdit.cloneNode(true) as HTMLButtonElement
    return `
      <a id="${this.editButtonId}" class="sgbmk-btn" data-unique-id="${this.uniqueId}">
      ${btn.outerHTML}
      </a>
    `;
  }

  renderDeleteButton() {
    if(this.isReport)
    {
      return '';
    }
    const btn = this.btnDelete.cloneNode(true) as HTMLButtonElement
    return `
      <a id="${this.deleteButtonId}" class="sgbmk-btn" data-unique-id="${this.uniqueId}">
      ${btn.outerHTML}
      </a>
    `;
  }

  renderAddNextButton() {
    if (!this.cardTypes.length) {
      return '';
    }

    if(this.isReport)
    {
      return '';
    }

    const btn = this.btnAdd.cloneNode(true) as HTMLButtonElement

    return `
      <a id="${this.addNextButtonId}" class="sgbmk-btn sgbmk-btn-add" data-unique-id="${this.uniqueId}">
        ${btn.outerHTML}
      </a>
    `;
  }
}
