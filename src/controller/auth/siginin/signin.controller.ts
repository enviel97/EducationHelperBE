import { Response, Request } from "express";
import bcrypt from "../../../helper/bcrypt";
import { success, error } from "../../../helper/https";
import { Token } from "../../../helper/jsontoken";
import { defaultAvatar } from "../../../helper/utils";
import { UserModel } from "../../../models/user.model";
import redis from "../../../config/redis";

export const signinWithEmail = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).catch(() => null);
  if (!user) return error(res).NOTFOUND("Invalid username or password");
  if (await bcrypt.compare(password, user.password)) {
    const token = Token.create(user.id);
    await redis.write(user.id, `${token}`);
    return success(res).CREATED({
      token: token,
      name: user.name || user.email,
      avatar: user.avatar,
    });
  }
  return error(res).NOTFOUND("Invalid username or password");
};

export const signinWithGoogle = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email })
    .lean()
    .catch(() => null);
  if (user) return addGoogleID(req, res, user);
  return addUser(req, res);
};

const addGoogleID = async (req: Request, res: Response, user: any) => {
  const { id, name, avatar } = req.body;
  const token = Token.create(user._id);
  if (!user.serviceId.googleID) {
    const update = {
      name,
      $set: { "serviceId.googleID": id },
      avatar: avatar || user.avatar,
    };
    const result = await UserModel.findByIdAndUpdate(user._id, update, {
      upsert: true,
    }).catch(() => null);
    if (!result) return error(res).CONFLICT("User can't update");
  }
  await redis.write(user.id, `${token}`);
  return success(res).ACCEPTED({
    token: token,
    name: user.name ?? user.email,
    avatar: user.avatar,
  });
};

const addUser = async (req: Request, res: Response) => {
  const { id, email, name, avatar, password } = req.body;
  const user = new UserModel({
    name,
    email,
    password,
    phoneNumber: "######",
    avatar: avatar || defaultAvatar(name),
    serviceId: { googleID: id },
  });

  const result = await user.save().catch((error: any) => {
    console.log(`[Create user]:\n${error}`);
    return null;
  });
  if (!result) return error(res).BADREQUEST("Can't add google account");
  const token = Token.create(user.id);
  await redis.write(user.id, `${token}`);
  return success(res).ACCEPTED({
    token: token,
    name: user.name ?? user.email,
    avatar: user.avatar,
  });
};
