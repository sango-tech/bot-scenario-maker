export interface INextCard {
  nodeIndex: number;
  uniqueId: string;
}

export interface IAnswer {
  id: string;
  title: string;
  nextCards: INextCard[];
  nodeIndex: number;
}

export interface ICard {
  id: string;
  uniqueId: string;
  title: string;
  titleBadge?: string;
  left: number;
  top: number;
  answers: IAnswer[];
}
