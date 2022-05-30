import logger from '../utils/logger';

class Bus {
  callbackOnEditCard!: Function;
  callbackOnDeleteCard!: Function;
  callbackOnAddNext!: Function;
  callbackOnChange!: Function;
  callbackOnAddCard!: Function;

  onAddCard = (callback: Function) => {
    logger.log('onAddCard was set');
    this.callbackOnAddCard = callback;
  };

  onCardEdit = (callback: Function) => {
    logger.log('onEditClick was set');
    this.callbackOnEditCard = callback;
  };

  onChange = (callback: Function) => {
    logger.log('onChange was set');
    this.callbackOnChange = callback;
  };

  onDeleteCard = (callback: Function) => {
    logger.log('onDeleteCard was set');
    this.callbackOnDeleteCard = callback;
  };
}

export default new Bus();
