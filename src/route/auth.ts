import { Router } from "express";
import express from "../config/express";
import {
  validator as siValidator,
  signinWithEmail,
  signinWithGoogle,
} from "../controller/auth/siginin";
import { validator as suValidator, register } from "../controller/auth/signup";

const router = Router();

// sign
router.post("/signin/email", ...siValidator.signinGG, signinWithEmail);
router.post("/signin/google", ...siValidator.signinEm, signinWithGoogle);
// signup
router.post("/signup", ...suValidator.signup, register);

export default express.inject({
  name: "auth",
  value: router,
});
