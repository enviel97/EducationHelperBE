import { body } from "express-validator";
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

export default { signup: [rule, validation] };
