export interface TimeStamp {
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Sorted {
  [field: string]: 1 | -1;
}
