import { Router } from "express";
import express from "../config/express";
import { createExams, validator } from "../controller/exams";

const router = Router();

// signup
router.post("/create/pdf", ...validator.verify, createExams);
router.post("/create/image", ...validator.verify, createExams);

export default express.inject({
  name: "exams",
  value: router,
});
