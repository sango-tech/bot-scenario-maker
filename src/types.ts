export interface IAnswer {
  id: string;
  title: string;
  nextUniqueIds: string[];
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
