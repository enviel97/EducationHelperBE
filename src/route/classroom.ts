import { Router } from "express";
import express from "../config/express";
import {
  classroomCreate,
  getClassroom,
  updateNameClassroom,
  deleteClassroom,
  getAllClassroom,
  searchClassroom,
  getMember,
  addMember,
  updateMember,
  deleteMember,
  getLimit,
} from "../controller/classroom";
import { verifyAccount } from "../helper/utils";

const router = Router();

router.post("/create", classroomCreate);
router.get("/top", getLimit);
router.get("/", getAllClassroom);
router.get("/search", searchClassroom);
router.get("/:id", getClassroom);
router.put("/update/:id", updateNameClassroom);
router.delete("/:id", deleteClassroom);

router.get("/:id/members", getMember);
router.put("/:id/members", addMember);
router.put("/:id/members/update", updateMember);
router.delete("/:id/members", deleteMember);

export default express.inject({
  name: "classrooms",
  validate: [verifyAccount],
  value: router,
});
