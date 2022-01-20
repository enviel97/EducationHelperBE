import { Response, Request } from "express";
import { error, success } from "../../../helper/https";
import { Token } from "../../../helper/jsontoken";
import { Sorted } from "../../../helper/type.helper";
import Exam from "../../../models/exams";

export const createExams = async (req: Request, res: Response) => {
  const file = req.file!;
  const { authenticate } = req.headers;
  const { examType, subject } = req.body;
  const exams = Exam.with({
    subject,
    file,
    examType,
    authenticate: `${authenticate}`,
  });
  const result = await exams.create().catch((err) => {
    error(res).CONFLICT(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};

export const getExams = async (req: Request, res: Response) => {
  const { id } = req.params;
  const exam = new Exam();
  const result = await exam.findOnce(id).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};

export const searchExams = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const sorted = req.query.sorted as string;
  const flow = (req.query.flow as string) === "desc" ? -1 : 1;

  const exam = new Exam();
  let sort: Sorted | undefined = undefined;
  if (!!sorted) {
    sort = { [sorted]: flow };
  }
  const result = await exam
    .search({ $text: { $search: new RegExp(query) } }, sort)
    .catch((err) => {
      error(res).BADREQUEST(err);
      return null;
    });
  if (!result) return;
  return success(res).ACCEPTED(result);
};

export const getAllExams = async (req: Request, res: Response) => {
  const sorted = req.query.sorted as string;
  const flow = (req.query.flow as string) === "desc" ? -1 : 1;
  let sort: Sorted | undefined = undefined;
  if (!!sorted) {
    sort = { [sorted]: flow };
  }
  const exam = new Exam();
  const data = Token.decode(`${req.headers.authenticate}`)!;
  const result = await exam.findAll(data, sort).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).CREATED(result);
};

export const deleteExams = async (req: Request, res: Response) => {
  const { id } = req.params;
  const exam = new Exam();
  const result = await exam.delete(id).catch((err) => {
    error(res).BADREQUEST(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};

export const updateExams = async (req: Request, res: Response) => {
  const file = req.file;
  const { id } = req.params;
  const { subject } = req.body;
  const exams = new Exam();
  const result = await exams.update(id, subject, file).catch((err) => {
    error(res).CONFLICT(err);
    return null;
  });
  if (!result) return;
  return success(res).OK(result);
};
