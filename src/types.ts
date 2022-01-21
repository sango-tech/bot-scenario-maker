export interface IAnswer {
  id: string;
  title: string;
}

export interface ICard {
  id: string;
  uniqueId: string;
  title: string;
  titleBadge?: string;
  answers: IAnswer[];
}
