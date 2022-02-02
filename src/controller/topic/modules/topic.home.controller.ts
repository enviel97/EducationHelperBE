import { Response, Request } from "express";
import { error, success } from "../../../helper/https";
import { Token } from "../../../helper/jsontoken";
import Topic from "../../../models/topic";

var repo: Topic = new Topic();

export const getTop = async (req: Request, res: Response) => {
  const data = Token.decode(`${req.headers.authenticate}`)!;
  const result = await repo.findAll(data, { limit: 10 }).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).ACCEPTED(result);
};
