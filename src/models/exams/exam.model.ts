import moment from "moment";
import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { ExamType, IContent, IExamSchema, IPoint, IQuest } from "./exam.types";

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

export default mongoose.client.model<IExamSchema>("Exam", ExamSchema);
