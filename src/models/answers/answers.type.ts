import { IContent, TimeStamp } from "../../helper/type.helper";

export enum StatusAnswer {
  EMPTY = "empty",
  SUBMIT = "submit",
  LATED = "lated",
}

export interface IAnswer {
  topic: string;
  member: string;
  status: StatusAnswer;
  content: IContent;
  grade: number;
  note: string;
  review: string;
}

export type IAnswerSchema = IAnswer & TimeStamp & Document;
