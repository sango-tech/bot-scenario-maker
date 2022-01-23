import { ICardType } from 'src/types';
import Logger from 'src/utils/logger';

class CardType {
  logger = new Logger();
  cardTypes: ICardType[] = [];

  setCardTypes = (cardTypes: ICardType[]) => {
    this.cardTypes = cardTypes;
  };
}

export default new CardType();
