import { Response, Request } from "express";
import { error, success } from "../../../helper/https";
import Classroom from "../../../models/classroom";

export const getMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const classroom = new Classroom();
  const result = await classroom.getMembers(id).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};

export const addMember = async (req: Request, res: Response) => {
  const { members } = req.body;
  const { id } = req.params;
  const classroom = Classroom.with({ members: [...members] });
  const result = await classroom.addMemeber(id).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};

export const updateMember = async (req: Request, res: Response) => {
  const { members } = req.body;
  const { id } = req.params;
  const classroom = Classroom.with({ members: [...members] });
  const result = await classroom.updateMember(id).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};

export const deleteMember = async (req: Request, res: Response) => {
  const { uid } = req.body;
  const { id } = req.params;
  if (!uid || uid.length === 0 || (uid.length === 1 && uid[0].length === 0)) {
    error(res).BADREQUEST("Uid array is not empty");
    return;
  }
  const classroom = new Classroom();
  const result = await classroom.deleteMember(id, [...uid]).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};
