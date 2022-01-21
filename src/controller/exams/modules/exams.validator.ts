import { NextFunction, Request, Response } from "express";
import multer, { MulterError } from "multer";
import { error } from "../../../helper/https";
import { fileFilter, verifyAccount } from "../../../helper/utils";

const verifyFile = (req: Request, res: Response, next: NextFunction) => {
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

const filterFile = (req: Request, res: Response, next: NextFunction) => {
  if (!!req.files) {
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

export default {
  verify: [verifyAccount, verifyFile],
  filterFile,
};
