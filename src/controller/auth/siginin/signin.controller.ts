import { Response, Request } from "express";
import bcrypt from "../../../helper/bcrypt";
import { success, error } from "../../../helper/https";
import { Token } from "../../../helper/jsontoken";
import { UserModel } from "../../../models/user.model";

export const signinWithEmail = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).catch(() => null);
  if (!user) return error(res).NOTFOUND("Invalid username or password");
  if (await bcrypt.compare(password, user.password)) {
    const token = Token.create(user.id);
    return success(res).CREATED({ token: token });
  }
  return error(res).NOTFOUND("Invalid username or password");
};

export const signinWithGoogleAccount = async (req: Request, res: Response) => {
  // Todo
  // "https://viblo.asia/p/authentication-with-google-oauth-using-nodejs-passportjs-mongodb-gAm5yqAV5db";
  console.log(req.body);
};
