import './assets/scss/styles.scss';
import { ICard, ICardType } from './types';
import Card from './components/card';
import cardType from './components/cardType';
import bus from './components/bus';
import cardObjects from './components/cardObjects';
import logger from './utils/logger';
import mouseDrawer from './components/mouseDrawer';
import renderer from './components/renderer';

export class ChatBotFlowsMaker {
  container: any;
  isReadOnly:boolean
  btnNext:HTMLButtonElement
  btnAdd:HTMLButtonElement
  btnEdit:HTMLButtonElement
  btnDelete:HTMLButtonElement
  iconStart:HTMLElement
  iconMessage:HTMLElement
  iconQuestion:HTMLElement
  iconGoal:HTMLElement
  directionType = 0;
  currentZoom = 100;

  constructor(container: any, isReadOnly:boolean=false, btnNext:HTMLButtonElement
    , btnAdd: HTMLButtonElement
    , btnEdit: HTMLButtonElement
    , btnDelete: HTMLButtonElement
    , iconStart: HTMLElement
    , iconMessage: HTMLElement
    , iconQuestion: HTMLElement
    , iconGoal: HTMLElement) {
    logger.debug('Init...');
    this.container = container || document.body;
    this.isReadOnly = isReadOnly
    this.btnNext = btnNext
    this.btnAdd = btnAdd
    this.btnEdit = btnEdit
    this.btnDelete = btnDelete
    this.iconStart = iconStart
    this.iconMessage = iconMessage
    this.iconQuestion = iconQuestion
    this.iconGoal = iconGoal

    mouseDrawer.setContainer(container);
    cardObjects.setContainer(container);
    return this;
  }

  addCard = (item: ICard) => {
    logger.log('Added card', item);
    const card = new Card(this.container, item, false, this.btnNext, this.btnAdd, this.btnEdit, this.btnDelete, this.iconStart, this.iconMessage, this.iconQuestion, this.iconGoal);
    cardObjects.addCard(card);
    return this;
  };

  updateCard(uniqueId: string, data: any) {
    cardObjects.updateCard(uniqueId, data);
    return this;
  }

  removeAllCards = () => {
    cardObjects.removeAllCards();
    return this;
  };

  render = () => {
    renderer.render(this.isReadOnly, this.directionType);
    bus.onDeleteCard((uniqueId: string) => {
      cardObjects.removeCard(uniqueId);
      renderer.render(this.isReadOnly, this.directionType);
    });
  };

  reRender() {
    renderer.render(this.isReadOnly, this.directionType);
  }

  onCardEdit = (callback: Function) => {
    bus.onCardEdit(callback);
  };

  onChange = (callback: Function) => {
    bus.onChange(callback);
  };

  onAddCard = (callback: Function) => {
    bus.onAddCard(callback);
  };

  setCardTypes = (cardTypes: ICardType[]) => {
    cardType.setCardTypes(cardTypes);
  };

  setZoomLevel = (level:number) => {
    this.currentZoom = level;
  };

  getZoomLevel = () => {
    return this.currentZoom
  };

  getContainer = () => {
    return this.container
  };

  setBoundingClientRectBeforeZoom = (rect:any) => {
    mouseDrawer.setBoundingClientRectBeforeZoom(rect);
  };

  setDirectionType = (value:number) => {
    this.directionType = value;
    mouseDrawer.setDirectionType(value)
  };
}
