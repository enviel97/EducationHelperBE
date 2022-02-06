import { NextFunction, Request, Response } from "express";
import { error } from "../../../helper/https";
import memberModel from "../../../models/member/member.model";
import topicModel from "../../../models/topic/topic.model";

export const verifyTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { topicId } = req.body;
  if (!topicId) {
    return error(res).BADREQUEST("You should input topic id");
  }
  const result = await topicModel
    .countDocuments({ _id: topicId })
    .catch((_) => 0);
  if (result === 0) {
    return error(res).BADREQUEST("Can't found topic, please try again");
  }
  return next();
};

export const verifyMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req);

  // console.log(res);
  const { memberId } = req.body;
  if (!memberId) {
    return error(res).BADREQUEST(
      "Who are you?, you should chose correct member"
    );
  }
  const result = await memberModel
    .countDocuments({ _id: memberId })
    .catch((_) => 0);
  if (result === 0) {
    return error(res).BADREQUEST("you should chose correct member");
  }
  return next();
};
