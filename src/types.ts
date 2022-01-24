export interface ICardType {
  name: string;
  displayText: string;
}

export interface INextCard {
  nodeIndex: number;
  uniqueId: string;
}

export interface IAnswer {
  id: string;
  title: string;
  nextCards: INextCard[];
}

export interface ICard {
  id: string;
  uniqueId: string;
  title: string;
  titleBadge?: string;
  cardType:string
  left: number;
  top: number;
  answers: IAnswer[];
}

export interface IDrawClickedNodeFrom {
  uniqueId: string;
  answerId: string;
}

export interface IDrawClickedNodeTo {
  uniqueId: string;
  nodeIndex: number;
}

export type ILine = Record<string, any>;
