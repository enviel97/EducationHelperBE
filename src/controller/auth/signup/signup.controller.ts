import { Response, Request } from "express";
import { success, error } from "../../../helper/https";
import { defaultAvatar } from "../../../helper/utils";
import { UserModel } from "../../../models/user.model";

export const register = async (req: Request, res: Response) => {
  const { name, email, phoneNumber, password, avatar } = req.body;
  const oldUser = await UserModel.findOne({ email }).catch(() => null);
  if (oldUser) return error(res).CONFLICT("Email is already");
  const photoUrl = avatar || defaultAvatar(name);
  const user = new UserModel({
    avatar: photoUrl,
    name,
    email,
    phoneNumber,
    password,
  });

  const result = await user.save().catch((error: any) => {
    console.log(`[Create user]:\n${error}`);
    return null;
  });
  if (result) {
    return success(res).CREATED({
      id: result.id ?? result._id,
      email: result.email,
      name: result.name,
      phoneNumber: result.phoneNumber,
      userType: result.userType,
      avatar: result.avatar,
    });
  }
  return error(res).BADREQUEST("Bad request");
};
