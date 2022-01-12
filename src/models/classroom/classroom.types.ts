import { TimeStamp } from "../../helper/type.helper";

export interface Classroom {
  creatorId: string;
  size: number;
  name: string;
  exams: string[];
  members: string[];
}

export type IClassroomSchema = Classroom & TimeStamp & Document;
