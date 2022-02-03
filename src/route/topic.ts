import { Router } from "express";
import express from "../config/express";
import {
  create,
  findAll,
  findOnce,
  remove,
  search,
  update,
  getTop,
  verifyDate,
  verifyId,
  getMembers,
} from "../controller/topic";
import { verifyAccount } from "../helper/utils";

const router = Router();

router.get("/top", verifyAccount, getTop);
router.get("/", verifyAccount, findAll);
router.get("/search", search);
router.get("/:id/members", getMembers);
router.get("/:id", findOnce);
router.delete("/:id", remove);
router.post("/create", ...[verifyAccount, verifyId, verifyDate], create);
router.post("/update/:id", update);

export default express.inject({
  name: "topics",
  value: router,
});
