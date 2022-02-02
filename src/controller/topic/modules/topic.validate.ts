import { Request, Response, NextFunction } from "express";
import { error } from "../../../helper/https";
import classroomModel from "../../../models/classroom/classroom.model";
import examModel from "../../../models/exams/exam.model";

export const verifyDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { expiredDate } = req.body;
  const date = new Date(expiredDate);
  if (isNaN(date.getDate())) {
    return error(res).BADREQUEST("Expired day is invalid");
  }
  return next();
};

export const verifyId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { classroomId, examId } = req.body;
  if (!classroomId || !examId) {
    return error(res).BADREQUEST("You should add exam and classroom");
  }
  const result = await Promise.all([
    classroomModel.countDocuments({ _id: classroomId }),
    examModel.countDocuments({ _id: examId }),
  ]).catch((_) => null);
  if (!result || (result?.[0] ?? 0) + (result?.[1] ?? 0) < 2) {
    return error(res).BADREQUEST("Can't find data with id");
  }
  return next();
};
