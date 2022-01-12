import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { IClassroomSchema } from "./classroom.types";
import MemberModel from "../member/member.model";

const ClassroomSchema = new Schema<IClassroomSchema>(
  {
    creatorId: { type: String, required: true },
    size: { type: Number, default: 0 },
    name: { type: String, required: true },
    exams: { type: [String], default: [] },
    members: { type: [String], default: [] },
  },
  { timestamps: true }
);

ClassroomSchema.pre("findOneAndDelete", async function (next) {
  const id: string = (await this.getQuery()["_id"]) ?? this.getQuery()["id"];
  await MemberModel.deleteMany({ classId: id })
    .then((value) => console.log(value))
    .catch((error) => console.log(error))
    .finally(() => next());
});

export default mongoose.client.model<IClassroomSchema>(
  "Classroom",
  ClassroomSchema
);
