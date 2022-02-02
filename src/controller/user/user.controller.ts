import { Request, Response } from "express";
import { error, success } from "../../helper/https";
import { Token } from "../../helper/jsontoken";
import { UserModel } from "../../models/user.model";

export const getUserInfo = async (req: Request, res: Response) => {
  const { authenticate } = req.headers;
  if (!authenticate) return error(res).UNAUTHORIZED("Invalid authenticate");
  try {
    const data = Token.decode(`${authenticate}`);
    if (!data) return error(res).BADREQUEST("Invalid authenticate");
    const user = await UserModel.findById(data, {
      _id: 0,
      name: 1,
      email: 1,
      phoneNumber: 1,
      avatar: 1,
      userType: 1,
    })
      .populate("exams", {
        _id: 1,
        expiredDate: 1,
      })
      .catch(() => null);
    if (!user) return error(res).NOTFOUND("User not found");
    return success(res).ACCEPTED({ id: data, ...(user as any)["_doc"] });
  } catch (err: any) {
    console.log(err);
    error(res).NOTFOUND(err);
  }
};
