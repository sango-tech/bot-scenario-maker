import logger from 'src/utils/logger';

class Bus {
  callbackOnEditCard!: Function;
  callbackOnDeleteCard!: Function;
  callbackOnAddNext!: Function;

  onCardEdit = (callback: Function) => {
    logger.log('onEditClick was set');
    this.callbackOnEditCard = callback;
  };

  onAddNext = (callback: Function) => {
    logger.log('onAddNext was set');
    this.callbackOnAddNext = callback;
  };

  onDeleteCard = (callback: Function) => {
    logger.log('onDeleteCard was set');
    this.callbackOnDeleteCard = callback;
  };
}

export default new Bus();
