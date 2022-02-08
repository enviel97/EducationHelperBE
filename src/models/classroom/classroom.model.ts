import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { IClassroomSchema } from "./classroom.types";
import MemberModel from "../member/member.model";
import TopicModel from "../topic/topic.model";

const ClassroomSchema = new Schema<IClassroomSchema>(
  {
    creatorId: { type: String, required: true, select: false },
    name: { type: String, required: true },
    exams: { type: [String], default: [] },
    size: { type: Number, default: 0 },
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
    .lean()
    .catch((error) => console.log(`[Topic Member error] ${error}`))
    .finally(() => next());

  await TopicModel.deleteMany({ classroom: classId })
    .lean()
    .catch((error) => console.log(`[Topic Classroom error] ${error}`))
    .finally(() => next());
});

export default mongoose.client.model<IClassroomSchema>(
  "Classroom",
  ClassroomSchema
);
