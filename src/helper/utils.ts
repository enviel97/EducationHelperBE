import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

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
