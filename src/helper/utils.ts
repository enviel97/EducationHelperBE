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
