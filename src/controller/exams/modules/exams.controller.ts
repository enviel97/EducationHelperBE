import { Response, Request } from "express";
import { error, success } from "../../../helper/https";
import ExamModel from "../../../models/exams";

export const createExams = async (req: Request, res: Response) => {
  const file = req.file!;
  const { authenticate } = req.headers;
  const { expirTime, examType, note, subject } = req.body;
  const exams = ExamModel.with({
    note,
    subject,
    file,
    expirTime,
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
