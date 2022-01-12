import { ObjectId, Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { IMemeberSchema, Member } from "./member.types";
import classroomModel from "../classroom/classroom.model";

const MemberSchema = new Schema<IMemeberSchema>({
  classId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, default: "male", lowercase: true },
  phoneNumber: { type: String, max: 10, min: 10 },
  mail: { type: String, default: "" },
  birth: { type: String, default: "" },
  avatar: { type: String, default: "" },
});

MemberSchema.post("save", async function (next) {
  const member = this;
  await classroomModel
    .findByIdAndUpdate(member.classId, {
      $push: { members: [member.id] },
    })
    .then((value) => console.log("[Update member]: " + value))
    .catch((error) => console.log("[Update member]" + error))
    .finally(next);
});

MemberSchema.post("insertMany", async function (res, next) {
  const members = res.map((mem: any) => mem._id.toString());
  await classroomModel
    .updateMany({ id: res[0].classId }, { $push: { members } })
    .then((value) => console.log("[Update members]: " + value))
    .catch((error) => console.log("[Update error members]" + error))
    .finally(next);
});

MemberSchema.post("findOneAndDelete", async function (res, next) {
  const idMembers = res._id.toString();
  console.log(idMembers);
  const idClassroom = res.classId.toString();
  console.log(idClassroom);
  await classroomModel
    .findByIdAndUpdate(idClassroom, { $pull: { members: idMembers } })
    .then((value) => console.log("[Update members]: " + value))
    .catch((error) => console.log("[Update error members]" + error))
    .finally(next);
});

export default mongoose.client.model<IMemeberSchema>("Member", MemberSchema);
