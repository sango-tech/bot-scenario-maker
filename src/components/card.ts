import { IAnswer, ICard } from 'src/types';
import { debouce, randomString } from 'src/utils/helper';
import logger from 'src/utils/logger';
import bus from './bus';
import cardType from './cardType';

export default class Card {
  card!: ICard;
  container!: any;

  constructor(container: any, card: ICard) {
    this.container = container;
    this.card = card;
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
    <div class="sgbmk__card" id="${this.elementId}" style="left: ${this.card.left}px; top: ${this.card.top}px;">
      <div class="sgbmk__card__title" id="${this.moveControlElementId}">
        <span class="sgbmk__card__title__badge">${this.card.titleBadge}</span>
        ${this.card.title}
      </div>
      <div class="sgbmk__card__answers">
        ${this.renderAnswers()}
      </div>

      <div class="sgbmk__card__actions">
        ${this.renderDeleteButton()}
        ${this.renderEditButton()}
        ${this.renderAddNextButton()}
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
    return `
      <a id="${this.editButtonId}" class="sgbmk-btn" data-unique-id="${this.uniqueId}">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen-to-square" class="svg-inline--fa fa-pen-to-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M383.1 448H63.1V128h156.1l64-64H63.1C28.65 64 0 92.65 0 128v320c0 35.35 28.65 64 63.1 64h319.1c35.34 0 63.1-28.65 63.1-64l-.0039-220.1l-63.1 63.99V448zM497.9 42.19l-28.13-28.14c-18.75-18.75-49.14-18.75-67.88 0l-38.62 38.63l96.01 96.01l38.62-38.63C516.7 91.33 516.7 60.94 497.9 42.19zM147.3 274.4l-19.04 95.22c-1.678 8.396 5.725 15.8 14.12 14.12l95.23-19.04c4.646-.9297 8.912-3.213 12.26-6.562l186.8-186.8l-96.01-96.01L153.8 262.2C150.5 265.5 148.2 269.8 147.3 274.4z"></path></svg>
      </a>
    `;
  }

  renderDeleteButton() {
    return `
      <a id="${this.deleteButtonId}" class="sgbmk-btn" data-unique-id="${this.uniqueId}">
        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-can" class="svg-inline--fa fa-trash-can" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M432 80h-82.38l-34-56.75C306.1 8.827 291.4 0 274.6 0H173.4C156.6 0 141 8.827 132.4 23.25L98.38 80H16C7.125 80 0 87.13 0 96v16C0 120.9 7.125 128 16 128H32v320c0 35.35 28.65 64 64 64h256c35.35 0 64-28.65 64-64V128h16C440.9 128 448 120.9 448 112V96C448 87.13 440.9 80 432 80zM171.9 50.88C172.9 49.13 174.9 48 177 48h94c2.125 0 4.125 1.125 5.125 2.875L293.6 80H154.4L171.9 50.88zM352 464H96c-8.837 0-16-7.163-16-16V128h288v320C368 456.8 360.8 464 352 464zM224 416c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16S208 183.2 208 192v208C208 408.8 215.2 416 224 416zM144 416C152.8 416 160 408.8 160 400V192c0-8.844-7.156-16-16-16S128 183.2 128 192v208C128 408.8 135.2 416 144 416zM304 416c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16S288 183.2 288 192v208C288 408.8 295.2 416 304 416z"></path></svg>
      </a>
    `;
  }

  renderAddNextButton() {
    if (!this.cardTypes.length) {
      return '';
    }

    return `
      <a id="${this.addNextButtonId}" class="sgbmk-btn sgbmk-btn-add" data-unique-id="${this.uniqueId}">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"></path></svg>
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

      html += `
        <li>
          <span>${cardType.displayText}</span>
          <ul class="sgbmk-second-menu">
            ${subMenu}

            <input type="button" class="${this.nextBtnCls} sgbmk-btn-next" value="Next" data-card-type="${cardType.name}" />
          </ul>
        </li>
      `;
    }

    return `<ul class="sgbmk-top-menu">${html}</ul>`;
  };
}
