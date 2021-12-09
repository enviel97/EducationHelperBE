import { Schema } from "mongoose";
import mongoose from "../config/mongose";
import bcrypt from "../helper/bcrypt";

export interface IUser extends Document {
  serviceId: { [key: string]: string };
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  avatar: string;
  userType: string;
  createdAt: Date | string;
  updatedAt: Date | string;
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
    password: { type: String, required: true, min: 6, max: 1024 },
    userType: { type: String, default: "User" },
    avatar: { type: String },
    serviceId: { type: ServiceId, default: {} },
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
