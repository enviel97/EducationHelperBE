import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { IMemeberSchema } from "./member.types";
import classroomModel from "../classroom/classroom.model";

const MemberSchema = new Schema<IMemeberSchema>({
  classId: { type: String, required: true, select: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, default: "male", lowercase: true },
  phoneNumber: { type: String, max: 10, min: 10 },
  mail: { type: String, default: "" },
  birth: { type: String, default: "" },
  avatar: { type: String, default: "" },
});

MemberSchema.index({ firstName: "text", lastName: "text" });

MemberSchema.post("save", async function (next) {
  const member = this;
  await classroomModel
    .findByIdAndUpdate(member.classId, {
      $inc: { size: 1 },
      $push: { members: [member.id] },
    })

    .catch((error) => console.log("[Update member]" + error))
    .finally(next);
});

MemberSchema.post("insertMany", async function (res, next) {
  const members = res.map((mem: any) => mem._id.toString());
  console.log(members);
  await classroomModel
    .findByIdAndUpdate(res[0].classId, {
      $inc: { size: members?.length ?? 0 },
      $push: { members },
    })
    .catch((error) => console.log("[Update error members]" + error))
    .finally(next);
});

MemberSchema.post("findOneAndDelete", async function (res, next) {
  const idMembers = res._id.toString();
  const idClassroom = res.classId.toString();
  await classroomModel
    .findByIdAndUpdate(idClassroom, {
      $inc: { size: -1 },
      $pull: { members: idMembers },
    })
    .catch((error) => console.log("[Update error members]" + error))
    .finally(next);
});

MemberSchema.post("deleteMany", async function (res, next) {
  const classId = res[0]?.classId.toString() ?? undefined;
  if (!classId) return;
  await classroomModel
    .findByIdAndUpdate({ classId }, { $set: { size: 0, members: [] } })
    .catch((error) => console.log("[Update error classroom]" + error))
    .finally(next);
});

export default mongoose.client.model<IMemeberSchema>("Member", MemberSchema);
