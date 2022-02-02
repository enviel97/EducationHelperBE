import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { IClassroomSchema } from "./classroom.types";
import MemberModel from "../member/member.model";

const ClassroomSchema = new Schema<IClassroomSchema>(
  {
    creatorId: { type: String, required: true, select: false },
    name: { type: String, required: true },
    exams: { type: [String], default: [] },
    members: {
      type: [String],
      default: [],
      ref: "Member",
    },
  },
  { timestamps: true }
);

ClassroomSchema.index({
  name: "text",
});

ClassroomSchema.post("findOneAndDelete", async function (res, next) {
  const classId: string = res._id.toString();
  await MemberModel.deleteMany({ classId: classId })
    .then((value) => console.log(value))
    .catch((error) => console.log(error))
    .finally(() => next());
});

export default mongoose.client.model<IClassroomSchema>(
  "Classroom",
  ClassroomSchema
);
