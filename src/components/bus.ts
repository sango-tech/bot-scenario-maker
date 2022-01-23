import Logger from 'src/utils/logger';

class Bus {
  logger = new Logger();
  callbackOnEditCard!: Function;
  callbackOnDeleteCard!: Function;
  callbackOnAddNext!: Function;

  onCardEdit = (callback: Function) => {
    this.logger.log('onEditClick was set');
    this.callbackOnEditCard = callback;
  };

  onAddNext = (callback: Function) => {
    this.logger.log('onAddNext was set');
    this.callbackOnAddNext = callback;
  };

  onDeleteCard = (callback: Function) => {
    this.logger.log('onDeleteCard was set');
    this.callbackOnDeleteCard = callback;
  };
}

export default new Bus();
