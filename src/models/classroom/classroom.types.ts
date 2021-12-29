import { TimeStamp } from "../../helper/type.helper";

export interface Member {
  uid: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  mail: string;
  birth: string;
}

export interface Classroom {
  creatorId: string;
  size: number;
  name: string;
  exams: string[];
  members: Member[];
}

export type IClassroomSchema = Classroom & TimeStamp & Document;
export type IMemeberSchema = Member & Document;
