import { Response, Request } from "express";
import { success, error } from "../../../helper/https";
import { UserModel } from "../../../models/user.model";

export const register = async (req: Request, res: Response) => {
  const { name, email, phoneNumber, password } = req.body;
  const oldUser = await UserModel.findOne({ email }).catch(() => null);
  if (oldUser) return error(res).CONFLICT("Email is already");
  const user = new UserModel({ name, email, phoneNumber, password });
  const result = await user.save().catch((error: any) => {
    console.log(`[Create user]:\n${error}`);
    return null;
  });
  if (result) {
    return success(res).CREATED({
      id: result.id ?? result._id,
      name: result.name,
      phoneNumber: result.phoneNumber,
      userType: result.userType,
    });
  }
  return error(res).BADREQUEST("Bad request");
};
