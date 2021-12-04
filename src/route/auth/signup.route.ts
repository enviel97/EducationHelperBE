import { Router } from "express";
import { validator, register } from "../../controller/auth/signup";

export const signup = (router: Router) => {
  router.post("/signup", ...validator, register);
};
