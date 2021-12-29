import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { IClassroomSchema, IMemeberSchema } from "./classroom.types";

const MemberSchema = new Schema<IMemeberSchema>(
  {
    uid: { type: String, require: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, default: "male", lowercase: true },
    phoneNumber: { type: String, max: 10, min: 10 },
    mail: { type: String, default: "" },
    birth: { type: String, default: "" },
  },
  { _id: false }
);

const ClassroomSchema = new Schema<IClassroomSchema>(
  {
    creatorId: { type: String, required: true },
    size: { type: Number, default: 0 },
    name: { type: String, required: true },
    exams: { type: [String], default: [] },
    members: { type: [MemberSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.client.model<IClassroomSchema>(
  "Classroom",
  ClassroomSchema
);
