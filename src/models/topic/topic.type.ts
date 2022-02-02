import { TimeStamp } from "../../helper/type.helper";

export interface ITopic {
  classroom: string;
  exam: string;
  creatorId: string;
  expiredDate: Date;
  note: string;
  answers: string[];
}

export type ITopicSchema = ITopic & Document & TimeStamp;
