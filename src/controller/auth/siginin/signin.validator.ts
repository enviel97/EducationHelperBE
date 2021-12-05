import { body } from "express-validator";
import { validation } from "../../../helper/utils";

const ruleGG = [
  body("email", "Email is empty or invalid")
    .notEmpty()
    .isEmail({ domain_specific_validation: true }),
];

const ruleEM = [
  body("email", "Email is empty or invalid")
    .notEmpty()
    .isEmail({ domain_specific_validation: true }),
  body("password", "Password is required").notEmpty(),
];

export default {
  signinGG: [ruleGG, validation],
  signinEm: [ruleEM, validation],
};
