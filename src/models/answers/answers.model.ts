import { Schema } from "mongoose";
import mongoose from "../../config/mongose";
import { IContent } from "../../helper/type.helper";
import topicModel from "../topic/topic.model";
import { IAnswerSchema, StatusAnswer } from "./answers.type";

const Content = new Schema<IContent>(
  {
    name: { type: String },
    originName: { type: String },
    download: { type: String },
    public: { type: String },
  },
  { _id: false }
);

const AnswerSchema = new Schema<IAnswerSchema>(
  {
    topic: { type: String, required: true, select: false },
    member: { type: String, required: true, ref: "Member" },
    status: { type: String, enum: StatusAnswer, required: true },
    grade: { type: Number, default: 0.0, max: 10.0, min: 0.0 },
    note: { type: String, default: "" },
    review: { type: String, default: "" },
    content: { type: Content },
  },
  { timestamps: true }
);

// middleware

AnswerSchema.post("save", async function (res: any) {
  const id = res.id ?? res._id;
  const { topic } = res;

  await topicModel
    .findByIdAndUpdate(topic, { $addToSet: { answers: id } })
    .lean()
    .catch((error) => {
      console.log(`[Answer Topic error]: ${error}`);
      return null;
    });
});

// export
export default mongoose.client.model<IAnswerSchema>("Answer", AnswerSchema);
