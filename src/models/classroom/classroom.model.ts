import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { IClassroomSchema } from "./classroom.types";
import MemberModel from "../member/member.model";
import { UserModel } from "../user.model";

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

ClassroomSchema.post("findOneAndDelete", async function (res, next) {
  const classId: string = res._id.toString;
  const userId: string = res.creatorId;
  console.log(res);
  await MemberModel.deleteMany({ classId: classId })
    .then((value) => console.log(value))
    .catch((error) => console.log(error))
    .finally(() => next());

  await UserModel.findByIdAndUpdate(classId, {
    $pull: { classrooms: userId },
  })
    .then((value) => console.log("[Delete classrooms]: " + value))
    .catch((error) => console.log("[Delete error classrooms]" + error))
    .finally(next);
});

ClassroomSchema.post("save", async function (next) {
  const classroom = this;
  await UserModel.findByIdAndUpdate(classroom.classId, {
    $push: { members: [classroom.creatorId] },
  })
    .then((value) => console.log("[Create user]: " + value))
    .catch((error) => console.log("[Create user error]" + error))
    .finally(next);
});

export default mongoose.client.model<IClassroomSchema>(
  "Classroom",
  ClassroomSchema
);
