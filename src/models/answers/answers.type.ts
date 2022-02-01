import { IContent } from "../exams/exam.types";

export enum StatusAnswer {
  EMPTY = "empty",
  SUBMIT = "submit",
  LATED = "lated",
}

export interface IAnswer {
  topicId: string;
  memberId: string;
  status: StatusAnswer;
  content: IContent;
  grade: string;
  note: string;
}
