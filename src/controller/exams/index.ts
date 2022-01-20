export { default as validator } from "./modules/exams.validator";
export {
  createExams,
  getExams,
  searchExams,
  getAllExams,
  deleteExams,
  updateExams,
} from "./modules/exams.controller";

export { getLimit } from "./modules/exams.home.controller";
