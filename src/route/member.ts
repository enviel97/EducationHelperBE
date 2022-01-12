import { Router } from "express";
import express from "../config/express";
import {
  findAll,
  insertMember,
  insertMembers,
  updateMember,
  deleteMember,
} from "../controller/members";
import { verifyAccount } from "../helper/utils";

const router = Router();

router.get("/:idClassroom", findAll);
router.put("/create/:idClassroom", insertMember);
router.put("/creates/:idClassroom", insertMembers);
router.put("/update/:idMember", updateMember);
router.delete("/:idMembers", deleteMember);

export default express.inject({
  name: "members",
  validate: [verifyAccount],
  value: router,
});
