import { Response, Request } from "express";
import { error, success } from "../../../helper/https";
import { Token } from "../../../helper/jsontoken";
import Topic from "../../../models/topic";

const repo: Topic = new Topic();
// async (req: Request, res: Response) => {};
export const findAll = async (req: Request, res: Response) => {
  const data = Token.decode(`${req.headers.authenticate}`)!;
  const result = await repo.findAll(data).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).ACCEPTED(result);
};

export const findOnce = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await repo.findOnce(id).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).ACCEPTED(result);
};

export const create = async (req: Request, res: Response) => {
  const { classroomId, examId, expiredDate, note = "" } = req.body;
  const data = Token.decode(`${req.headers.authenticate}`)!;
  const result = await repo
    .create({
      creatorId: data,
      classroom: classroomId,
      exam: examId,
      expiredDate: expiredDate,
      note: note,
      answers: [],
    })
    .catch((err) => {
      error(res).NOTFOUND(err);
      return null;
    });
  if (!result) return;
  return success(res).CREATED(result);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { expiredDate, note } = req.body;

  const result = await repo
    .update(id, { expiredDate: expiredDate, note: note })
    .catch((err) => {
      error(res).NOTFOUND(err);
      return null;
    });
  if (!result) return;
  return success(res).ACCEPTED(result);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await repo.delete(id).catch((err) => {
    error(res).CONFLICT(err);
    return null;
  });
  if (!result) return;
  return success(res).ACCEPTED(result);
};

export const search = async (req: Request, res: Response) => {
  const { query, to, from } = req.query as {
    query: string;
    to: string;
    from: string;
  };

  let date = undefined;
  if (!!from && !!to) {
    const _from = new Date(from);
    const _to = new Date(to);
    if (!!_from && !!_to) date = { from: _from, to: _to };
  }
  const result = await repo.search(query, date).catch((err) => {
    error(res).CONFLICT(err);
    return null;
  });
  if (!result) return;
  return success(res).ACCEPTED(result);
};
