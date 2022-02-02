import { Schema } from "mongoose";
import mongoose from "../config/mongose";
import bcrypt from "../helper/bcrypt";
import { TimeStamp } from "../helper/type.helper";

export interface IUser extends TimeStamp, Document {
  serviceId: { [key: string]: string };
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  avatar: string;
  userType: string;
  classrooms: string[];
  exams: string[];
}

const ServiceId = new Schema(
  {
    googleID: { type: String, default: "" },
    zaloID: { type: String, default: "" },
    facebookID: { type: String, default: "" },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, min: 6, max: 255 },
    email: { type: String, required: true, min: 6, max: 255 },
    phoneNumber: { type: String, min: 6 },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
      select: false,
    },
    userType: { type: String, default: "User" },
    avatar: { type: String },
    serviceId: { type: ServiceId, default: {} },
    classrooms: { type: [String], default: [] },
    exams: { type: [String], default: [], ref: "Topic" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  let user = this;
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(user.password);
    user.password = hash;
  }
  return next();
});

export const UserModel = mongoose.client.model<IUser>("User", UserSchema);
