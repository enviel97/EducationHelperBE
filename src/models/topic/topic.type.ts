import { TimeStamp } from "../../helper/type.helper";
import { StatusAnswer } from "../answers/answers.type";

export interface IAnswer {
  id: string;
  memberId: string;
  status: StatusAnswer;
  grade: number;
}

export interface ITopic {
  classId: string;
  examId: string;
  creatorId: string;
  expiredDate: string;
  answers: IAnswer[];
}

export type ITopicSchema = ITopic & Document & TimeStamp;
