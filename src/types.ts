export interface ICardType {
  name: string;
  displayText: string;
}

export interface INextCard {
  nodeIndex: number;
  uniqueId: string;
}

export interface ICardAnswer {
  id: string;
  title: string;
  nextCards: INextCard[];
  totalUsers: number;
}

export interface ICard {
  id: string;
  uniqueId: string;
  displayId: string;
  title: string;
  titleBadge?: string;
  cardType:string
  left: number;
  top: number;
  answers: ICardAnswer[];
  totalUsers: number;
  labelTotalUsers: string;
  isHideEditBtn?:boolean;
  isHideAddBtn?:boolean;
  isHideDeleteBtn?:boolean;
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
