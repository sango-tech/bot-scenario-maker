import cardObjects from './cardObjects';
import mouseDrawer from './mouseDrawer';

class Renderer {
  callbackOnEditCard!: Function;
  callbackOnDeleteCard!: Function;
  callbackOnAddNext!: Function;
  render = (isReport:boolean) => {
    this.removeAllCards();
    for (const cardObject of cardObjects.items) {
      cardObject.isReport = isReport;
      cardObject.render();
    }

    cardObjects.connectObjectsByLines();
    cardObjects.initDraggableCards();

    this.registerMouseDrawer(isReport);
  };

  registerMouseDrawer = (isReport:boolean) => {
    mouseDrawer.init(isReport);
    // Redraw lines after mouse event done
    mouseDrawer.setDrawDoneCallback(cardObjects.connectObjectsByLines);
  };

  removeAllCards = () => {
    const cards = document.querySelectorAll('.sgbmk__card');
    for (var i = 0; i < cards.length; i++) {
      const card = cards[i];
      card.remove();
    }

    cardObjects.removeAllLines();
  };
}

export default new Renderer();
