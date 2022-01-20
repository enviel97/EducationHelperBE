import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { ExamType, IContent, IExamSchema, IPoint, IQuest } from "./exam.types";
import { UserModel } from "../user.model";

const Point = new Schema<IPoint>(
  {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  { _id: false }
);

const Quest = new Schema<IQuest>(
  {
    ask: { type: Point, default: { x: 0, y: 0 } },
    answer: { type: [Point], default: [] },
  },
  { _id: false }
);

const Content = new Schema<IContent>(
  {
    name: { type: String },
    originName: { type: String },
    download: { type: String },
    public: { type: String },
    offset: { type: [[Quest]] },
  },
  { _id: false }
);

const ExamSchema = new Schema<IExamSchema>(
  {
    creatorId: { type: String, required: true },
    subject: { type: String, default: "" },
    examType: {
      type: String,
      enum: ExamType,
      default: ExamType.ESSAY,
      uppercase: true,
    },
    content: { type: Content },
  },
  { timestamps: true }
);

ExamSchema.index({
  subject: "text",
  "content.originName": "text",
  "content.name": "text",
});

ExamSchema.post("save", async function (res, next) {
  const exam = res;
  await UserModel.findByIdAndUpdate(exam.creatorId, {
    $addToSet: { exams: [exam.id ?? exam._id] },
  })
    .then((value) => console.log("[Create user]: " + value))
    .catch((error) => console.log("[Create user error]" + error))
    .finally(next);
});

ExamSchema.post("findOneAndDelete", async function (res, next) {
  const classId: string = res._id.toString();
  const userId: string = res.creatorId;

  await UserModel.findByIdAndUpdate(userId, {
    $pull: { classrooms: classId },
  })
    .then((value) => console.log("[Delete classrooms]: " + value))
    .catch((error) => console.log("[Delete error classrooms]" + error))
    .finally(next);
});

export default mongoose.client.model<IExamSchema>("Exam", ExamSchema);
