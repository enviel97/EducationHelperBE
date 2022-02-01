import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { StatusAnswer } from "../answers/answers.type";
import { ITopicSchema, IAnswer } from "./topic.type";
import classroomModel from "../classroom/classroom.model";
import { UserModel } from "../user.model";

const AnswerSchema = new Schema<IAnswer>(
  {
    id: { type: String, default: "" },
    memberId: { type: String, required: true },
    status: { type: String, enum: StatusAnswer, default: StatusAnswer.EMPTY },
    grade: { type: Number, default: -1.0 },
  },
  { id: false }
);

const TopicSchema = new Schema<ITopicSchema>({
  classId: { type: String, required: true },
  examId: { type: String, required: true },
  creatorId: { type: String, required: true },
  expiredDate: { type: String },
  answers: { type: [AnswerSchema], default: [] },
});

TopicSchema.post("save", async function (res: any) {
  const { classId, creatorId } = res;
  const id = res.id ?? res._id;
  // Classroom Model
  await classroomModel
    .findByIdAndUpdate(classId, { $addToSet: { exams: id } })
    .catch((error) => console.log(`Topic-Class eroor: ${error}`));

  // User Model
  await UserModel.findByIdAndUpdate(creatorId, {
    $push: { exams: { id: id, expiredDate: res.expiredDate } },
  }).catch((error) => console.log(`Topic-User eroor: ${error}`));
});

export default mongoose.client.model<ITopicSchema>("Topic", TopicSchema);
