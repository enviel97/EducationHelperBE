import { NextFunction, Request, Response } from "express";
import { error } from "../../../helper/https";
import answersModel from "../../../models/answers/answers.model";
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

export const verifyMemberCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { topicId, memberId } = req.body;
  if (!memberId) {
    return error(res).BADREQUEST(
      "Who are you?, you should chose correct member"
    );
  }
  const rule1 = await memberModel
    .countDocuments({ _id: memberId })
    .catch((_) => 0);
  if (rule1 === 0) {
    return error(res).BADREQUEST("you should chose correct member");
  }

  const rule2 = await answersModel
    .find({ member: memberId }, { topic: 1 })
    .catch((error) => {
      console.log(`[Verify member]: ${error}`);
      return null;
    });
  if (!!rule2) {
    const find = rule2.filter((value) => value.topic === topicId).length;
    console.log(rule2);
    if (find > 0) {
      return error(res).BADREQUEST("your answer is already");
    }
  }
  return next();
};

export const verifyMemberUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { memberId } = req.body;
  if (!memberId) {
    return error(res).BADREQUEST(
      "Who are you?, you should chose correct member"
    );
  }
  const rule1 = await memberModel
    .countDocuments({ _id: memberId })
    .catch((_) => 0);
  if (rule1 === 0) {
    return error(res).BADREQUEST("you should chose correct member");
  }

  return next();
};
