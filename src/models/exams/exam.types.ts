import { TimeStamp } from "../../helper/type.helper";

export enum ExamType {
  QUIZ = "QUIZ",
  ESSAY = "ESSAY",
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

export interface IExam {
  creatorId: string;
  examType: ExamType;
  expirTime: Date;
  content: IContent;
}

export type IExamSchema = IExam & TimeStamp & Document;
