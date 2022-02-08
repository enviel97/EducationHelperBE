import { IContent, TimeStamp } from "../../helper/type.helper";

export enum ExamType {
  QUIZ = "QUIZ",
  ESSAY = "ESSAY",
}

export interface IExam {
  creatorId: string;
  subject: string;
  examType: ExamType;
  content: IContent;
}

export type IExamSchema = IExam & TimeStamp & Document;
