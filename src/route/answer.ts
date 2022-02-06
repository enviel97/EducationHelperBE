import { Router } from "express";
import express from "../config/express";
import {
  create,
  getOnce,
  grade,
  update,
  verifyTopic,
  verifyMember,
} from "../controller/answer";
import { filterFile, verifyAccount, verifyFile } from "../helper/utils";

const router = Router();

router.get("/:id", getOnce);
router.put("/grade/:id", verifyAccount, grade);
router.post("/create", /*verifyMember, verifyTopic, verifyFile, */ create);
router.post("/update/:id", verifyMember, verifyTopic, filterFile, update);

export default express.inject({
  name: "answers",
  value: router,
});
