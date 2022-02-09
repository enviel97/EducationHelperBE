import { Router } from "express";
import express from "../config/express";
import {
  create,
  getOnce,
  grade,
  update,
  verifyTopic,
  verifyMemberCreate,
  verifyMemberUpdate,
} from "../controller/answer";
import { filterFile, verifyAccount, verifyFile } from "../helper/utils";

const router = Router();

router.get("/:id", getOnce);
router.put("/grade/:id", verifyAccount, grade);
router.post("/create", verifyFile, verifyMemberCreate, verifyTopic, create);
router.post("/update/:id", filterFile, update);

export default express.inject({
  name: "answers",
  value: router,
});
