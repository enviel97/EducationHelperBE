import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { error } from "./https";
import { Token } from "./jsontoken";
import redis from "../config/redis";
import multer, { MulterError } from "multer";

export function validation(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const extractedErrors: any[] = [];
  errors
    .array({ onlyFirstError: true })
    .map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(422).json({ errors: extractedErrors });
}

export const defaultAvatar = (name: string) => {
  const names = (name as string).toUpperCase().trim().split(" ");
  const size = names.length;
  const defaultAvatar = `https://fakeimg.pl/500x500/?text=${
    names[size - 1][0]
  }${!names[size - 2] ? "" : names[size - 2][0]}`;

  return defaultAvatar;
};

export const fileFilter = (
  _: Request,
  file: Express.Multer.File | undefined,
  onDone: any
) => {
  const regex = new RegExp(/.(jpg|jpeg|png|pdf|rar|zip)$/);
  if (!file || !regex.test(file.originalname)) {
    return onDone(
      new Error("Only allow file type jpg, jpeg, png, pdf, rar or zip"),
      false
    );
  }
  onDone(null, true);
};

export const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authenticate } = req.headers;
  if (!authenticate) {
    return error(res).UNAUTHORIZED("Token is empty");
  }
  const data = Token.decode(`${authenticate}`);
  if (!data) {
    return error(res).UNAUTHORIZED("Token is invalid");
  }

  const result = await redis.read(`${data}`).catch((error) => {
    console.log(`[Exam verify error]:\n${error}`);
    return undefined;
  });
  if (result === undefined) {
    return error(res).UNAUTHORIZED("Token is invalid");
  }
  return next();
};

export const verifyFile = (req: Request, res: Response, next: NextFunction) => {
  if (!!req.files) {
    error(res).BADREQUEST("Allow single files");
    return;
  }
  const storage = multer.memoryStorage();
  const upload = multer({ storage, fileFilter }).single("content");
  return upload(req, res, (err) => {
    if (err instanceof Error) return error(res).BADREQUEST(err.message);
    if (err instanceof MulterError) return res.send(err);
    if (!req.file) return error(res).BADREQUEST("File is required");
    next();
  });
};

export const filterFile = (req: Request, res: Response, next: NextFunction) => {
  if (req.files?.length ?? 0 > 1) {
    error(res).BADREQUEST("Allow single files");
    return;
  }
  const storage = multer.memoryStorage();
  const upload = multer({ storage, fileFilter }).single("content");
  return upload(req, res, (err) => {
    if (err instanceof Error) return error(res).BADREQUEST(err.message);
    if (err instanceof MulterError) return res.send(err);
    next();
  });
};
