import { Router } from "express";
import express from "../../root/express";
import { signin } from "./signin.route";
import { signup } from "./signup.route";
const router = Router();

signup(router);
signin(router);

export default express.inject({
  name: "auth",
  value: router,
});
