import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { ITopicSchema } from "./topic.type";
import classroomModel from "../classroom/classroom.model";
import { UserModel } from "../user.model";

const TopicSchema = new Schema<ITopicSchema>(
  {
    classroom: { type: String, required: true, ref: "Classroom" },
    exam: { type: String, required: true, ref: "Exam" },
    creatorId: { type: String, required: true, select: false },
    expiredDate: { type: Date, required: true },
    note: { type: String },
    answers: { type: [String], default: [], ref: "Answer" },
  },
  { timestamps: true }
);

TopicSchema.index({
  "classroom.name": "text",
  "exam.subject": "text",
  "exam.content.originName": "text",
  "exam.content.name": "text",
});

//middleware
TopicSchema.post("save", async function (res: any) {
  const { classroom, creatorId } = res;
  const id = res.id ?? res._id;
  const classId = classroom._id ?? classroom;
  // Classroom Model
  await classroomModel
    .findByIdAndUpdate(classId, { $addToSet: { exams: id } })
    .catch((error) => console.log(`Topic-Class eroor: ${error}`));

  // User Model
  await UserModel.findByIdAndUpdate(creatorId, {
    $addToSet: { exams: id },
  }).catch((error) => console.log(`Topic-User eroor: ${error}`));
});

TopicSchema.post("findOneAndDelete", async function (res: any) {
  const { classroom, creatorId } = res;
  const id = res.id ?? res._id;
  const classId = classroom._id ?? classroom;
  // Classroom Model
  await classroomModel
    .findByIdAndUpdate(classId, { $pull: { exams: id } })
    .catch((error) => console.log(`Topic-Class eroor: ${error}`));

  // User Model
  await UserModel.findByIdAndUpdate(creatorId, {
    $pull: { exams: id },
  }).catch((error) => console.log(`Topic-User eroor: ${error}`));
});

export default mongoose.client.model<ITopicSchema>("Topic", TopicSchema);
