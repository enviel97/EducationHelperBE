import Answer from "../../../models/answers";
import { Response, Request } from "express";
import { error, success } from "../../../helper/https";

const repo: Answer = new Answer();

const tryPraseDate = (date: any) => {
  let _date = new Date();
  if (!!date) {
    const _createDate = new Date(date);
    if (!!_createDate) _date = _createDate;
  }
  return _date;
};

export const create = async (req: Request, res: Response) => {
  const file = req.file!;
  const { topicId, memberId, createDate, note = "" } = req.body;
  const result = await repo
    .create({
      topicId: topicId,
      memberId: memberId,
      createDate: tryPraseDate(createDate),
      note: note,
      file: file,
    })
    .catch((err) => {
      error(res).CONFLICT(err);
      return null;
    });
  if (!result) return;
  return success(res).OK(result);
};

export const update = async (req: Request, res: Response) => {
  const file = req.file;
  const { id } = req.params;
  const { topicId, createDate = new Date(), note } = req.body;
  const result = await repo
    .update(id, {
      topicId: topicId,
      memberId: "",
      createDate: tryPraseDate(createDate),
      note: note,
      file: file,
    })
    .catch((err) => {
      error(res).CONFLICT(err);
      return null;
    });
  if (!result) return;
  return success(res).OK(result);
};

export const getOnce = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await repo.findOnce(id).catch((err) => {
    error(res).CONFLICT(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};

export const grade = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { grade, review = "" } = req.body;
  let _grade = Number.parseFloat(grade);
  if (!_grade) _grade = 0.0;
  const result = await repo.grade(id, _grade, review).catch((err) => {
    error(res).CONFLICT(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};
