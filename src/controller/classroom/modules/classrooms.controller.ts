import { Response, Request } from "express";
import { error, success } from "../../../helper/https";
import { Token } from "../../../helper/jsontoken";
import { Sorted } from "../../../helper/type.helper";
import Classroom from "../../../models/classroom";

export const classroomCreate = async (req: Request, res: Response) => {
  const { members, exams, name } = req.body;
  const classroom = Classroom.with({ members, exams, name });
  const data = Token.decode(`${req.headers.authenticate}`)!;
  const result = await classroom.create(data).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).CREATED(result);
};

export const getClassroom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const classroom = new Classroom();
  const result = await classroom.get(id).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};

export const updateNameClassroom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const classroom = Classroom.with({ name });
  const result = await classroom.update(id).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).CREATED({ ...result.toObject(), name: name });
};

export const searchClassroom = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const sorted = req.query.sorted as string;
  const flow = (req.query.flow as string) === "desc" ? -1 : 1;

  const classroom = new Classroom();
  let sort: Sorted | undefined = undefined;
  if (!!sorted) {
    sort = { [sorted]: flow };
  }
  const result = await classroom
    .search({ name: new RegExp(query) }, sort)
    .catch((err) => {
      error(res).BADREQUEST(err);
      return null;
    });
  if (!result) return;
  return success(res).ACCEPTED(result);
};

export const getAllClassroom = async (req: Request, res: Response) => {
  const sorted = req.query.sorted as string;
  const flow = (req.query.flow as string) === "desc" ? -1 : 1;
  let sort: Sorted | undefined = undefined;
  if (!!sorted) {
    sort = { [sorted]: flow };
  }
  const classroom = new Classroom();
  const data = Token.decode(`${req.headers.authenticate}`)!;
  const result = await classroom.findAll(data, sort).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).CREATED(result);
};

export const deleteClassroom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const classroom = new Classroom();
  const result = await classroom.delete(id).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};
