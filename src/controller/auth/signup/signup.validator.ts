import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import multer, { MulterError } from "multer";
import { error } from "../../../helper/https";
import { validation } from "../../../helper/utils";

const rule = [
  body("name", "Display name is required").notEmpty(),
  body("email", "Email is empty or invalid")
    .notEmpty()
    .isEmail({ domain_specific_validation: true }),
  body("phoneNumber", "Mobile phone is empty or invalid")
    .notEmpty()
    .isMobilePhone("vi-VN"),
  body(
    "password",
    "Password should be combination of one uppercase, one lower case, one special char, one digit and min 6"
  )
    .notEmpty()
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~.]).{6,}$/,
      "i"
    ),
];
const validationImage = (req: Request, res: Response, next: NextFunction) => {
  if (!!req.files) {
    error(res).BADREQUEST("Allow single files");
    return;
  }
  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    fileFilter: (
      _: Request,
      file: Express.Multer.File | undefined,
      onDone: any
    ) => {
      const regex = new RegExp(/.(jpg|jpeg|png)$/);
      if (!file || !regex.test(file.originalname)) {
        return onDone(new Error("Only allow file type jpg, jpeg, png"), false);
      }
      onDone(null, true);
    },
  }).single("avatar");
  return upload(req, res, (err) => {
    if (err instanceof Error) return error(res).BADREQUEST(err.message);
    if (err instanceof MulterError) return res.send(err);
    next();
  });
};

export default { signup: [validationImage, rule, validation] };
