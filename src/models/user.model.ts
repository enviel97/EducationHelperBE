import { model, Mongoose, Schema } from "mongoose";

export enum UType {
  User = "User",
  Admin = "Admin",
}

export enum AType {
  Google = "Google",
  Email = "Email",
}

const userSchema = new Schema(
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

export default model("user", userSchema);
