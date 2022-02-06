export interface TimeStamp {
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Sorted {
  [field: string]: 1 | -1;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IQuest {
  ask: IPoint;
  answer: IPoint[];
}

export interface IContent {
  name: string;
  originName: string;
  download: string;
  public: string;
  offset?: IQuest[][];
}
