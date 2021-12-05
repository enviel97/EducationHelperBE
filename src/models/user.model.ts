import { Schema } from "mongoose";
import mongoose from "../config/mongose";
import bcrypt from "../helper/bcrypt";

export enum UType {
  User = "User",
  Admin = "Admin",
}

export enum AType {
  Google = "Google",
  Email = "Email",
}
export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: UType;
  accountType: AType;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true, min: 6, max: 255 },
    email: { type: String, required: true, min: 6, max: 255 },
    phoneNumber: { type: String, min: 6 },
    password: { type: String, required: true, min: 6, max: 1024 },
    userType: { type: String, default: UType.User, enum: UType },
    accountType: { type: String, default: AType.Email, enum: AType },
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
