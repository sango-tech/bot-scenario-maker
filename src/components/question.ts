import Logger from 'src/utils/logger';

export default class Question {
  logger = new Logger();

  async render() {
    this.logger.log('AddressForm:render');

  }

  renderHTML() {
    return `
    <div class="sgbmk__question">

    </div>
    `;
  }
}
