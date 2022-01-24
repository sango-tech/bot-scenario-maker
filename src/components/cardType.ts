import { ICardType } from '../types';

class CardType {
  cardTypes: ICardType[] = [];

  setCardTypes = (cardTypes: ICardType[]) => {
    this.cardTypes = cardTypes;
  };
}

export default new CardType();
