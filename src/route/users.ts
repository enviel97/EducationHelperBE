import { Router } from "express";
import express from "../config/express";
import { getUserInfo } from "../controller/user";

const router = Router();
router.get("/", getUserInfo);

export default express.inject({
  name: "users",
  value: router,
});
