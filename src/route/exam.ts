import { Router } from "express";
import express from "../config/express";
import {
  createExams,
  getExams,
  searchExams,
  getAllExams,
  deleteExams,
  validator,
  getLimit,
  updateExams,
} from "../controller/exams";

const router = Router();

// signup
router.get("/top", getLimit);
router.get("/", getAllExams);
router.get("/search", searchExams);
router.get("/:id", getExams);
router.delete("/:id", deleteExams);
router.post("/create", ...validator.verify, createExams);
router.put("/update/:id", updateExams);

export default express.inject({
  name: "exams",
  value: router,
});
