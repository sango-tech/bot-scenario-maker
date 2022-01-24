import logger from '../utils/logger';

class Bus {
  callbackOnEditCard!: Function;
  callbackOnDeleteCard!: Function;
  callbackOnAddNext!: Function;
  callbackOnChange!: Function;

  onCardEdit = (callback: Function) => {
    logger.log('onEditClick was set');
    this.callbackOnEditCard = callback;
  };

  onAddNext = (callback: Function) => {
    logger.log('onAddNext was set');
    this.callbackOnAddNext = callback;
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
