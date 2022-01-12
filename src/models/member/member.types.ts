export interface Member {
  classId: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber?: string;
  mail?: string;
  birth?: string;
}

export type IMemeberSchema = Member & Document;
