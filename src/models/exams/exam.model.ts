import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { ExamType, IExamSchema } from "./exam.types";
import TopicModel from "../topic/topic.model";
import { IContent, IPoint, IQuest } from "../../helper/type.helper";

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
    creatorId: { type: String, required: true, select: false },
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

ExamSchema.post("findOneAndDelete", async function (res, next) {
  const examId: string = res._id.toString();
  const topics = await TopicModel.find({ exam: examId })
    .lean()
    .catch((error) => {
      console.log(`[Topic Exam error] ${error}`);
      return null;
    });

  if ((!topics || topics.length === 0) ?? true) return;
  Promise.all([
    topics.forEach(async () => {
      await TopicModel.findOneAndDelete({ exam: examId })
        .lean()
        .catch((error) => console.log(`[Topic-Exam error] ${error}`));
    }),
  ]).catch((err) => {
    console.log(`[Exam-topics remove error]: ${err} `);
  });
});

export default mongoose.client.model<IExamSchema>("Exam", ExamSchema);
