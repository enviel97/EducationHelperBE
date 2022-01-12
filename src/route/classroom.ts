import { Router } from "express";
import express from "../config/express";
import {
  classroomCreate,
  getClassroom,
  updateNameClassroom,
  deleteClassroom,
  getAllClassroom,
  searchClassroom,
  getLimit,
} from "../controller/classroom";
import { verifyAccount } from "../helper/utils";

const router = Router();

router.get("/top", getLimit);
router.get("/", getAllClassroom);
router.get("/search", searchClassroom);
router.get("/:id", getClassroom);
router.put("/update/:id", updateNameClassroom);
router.delete("/:id", deleteClassroom);
router.post("/create", classroomCreate);

export default express.inject({
  name: "classrooms",
  validate: [verifyAccount],
  value: router,
});
