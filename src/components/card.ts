import { ICard, ICardAnswer } from '../types';
import { debouce, randomString } from '../utils/helper';
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
    logger.log('Card:render');
    this.renderHTML();
    this.registerDeleteCardEvent();
    this.registerEditCardEvent();
    this.registerNextAddNextCardEvent();
  }

  renderHTML() {
    const html = `
      <div class="sgbmk__card__title" id="${this.moveControlElementId}">
        <span class="sgbmk__card__title__badge">${this.card.titleBadge}</span>
        ${this.card.title}<br>
        ${this.card.displayId}
      </div>
      <div class="sgbmk__card__answers">
        ${this.renderAnswers()}
        ${this.renderTotalUsers()}
      </div>
      <div class="sgbmk__card__actions">
        ${this.renderDeleteButton()}
        ${this.renderEditButton()}
        ${this.renderAddNextButton()}
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

  registerNextAddNextCardEvent = () => {
    debouce(() => {
      const nextBtns = document.querySelectorAll(`.${this.nextBtnCls}`);
      if (!nextBtns || !bus.callbackOnAddNext) {
        return;
      }

      const that = this;
      for (var i = 0; i < nextBtns.length; i++) {
        const nextBtn = nextBtns[i];
        nextBtn.addEventListener('click', function (event) {
          const selectedAnswerIds: string[] = [];
          let cardType;

          const target = event.target as HTMLElement;
          cardType = target.getAttribute('data-card-type');

          const checkboxs = target.parentElement?.querySelectorAll('input[type="checkbox"]');
          if (!checkboxs) {
            return;
          }

          for (var i = 0; i < checkboxs.length; i++) {
            const checkbox = checkboxs[i] as any;
            if (checkbox.checked) {
              selectedAnswerIds.push(checkbox.value);
            }
          }

          bus.callbackOnAddNext({ cardType, uniqueId: that.uniqueId, selectedAnswerIds });
        });
      }
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
        ${this.renderMenuAnswerNext()}
      </a>
    `;
  }

  renderMenuAnswerNext = () => {
    let html = '';
    for (const cardType of this.cardTypes) {
      let subMenu = '';
      for (const answer of this.answers) {
        const elId = randomString();
        subMenu += `
          <li
            data-card-type="${cardType.name}"
            data-answer-id="${answer.id}">
            <input type="checkbox" value="${answer.id}" id="${elId}" />
            <label for="${elId}">${answer.title}</label>
          </li>
        `;
      }

     const btn = this.btnNext.cloneNode(true) as HTMLButtonElement
     btn.classList.add(this.nextBtnCls)
     btn.classList.add("sgbmk-btn-next")
     btn.setAttribute("data-card-type", cardType.name);
      html += `
        <li>
          <span>${cardType.displayText}</span>
          <ul class="sgbmk-second-menu">
            ${subMenu}
            ${btn.outerHTML}
          </ul>
        </li>
      `;
    }

    return `<ul class="sgbmk-top-menu">${html}</ul>`;
  };
}
