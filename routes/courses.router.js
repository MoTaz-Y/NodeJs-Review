const express = require("express");
const router = express.Router();
const courseValidation = require("../middlewares/coursesValidation");
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses.controller");

router.route("/").get(getAllCourses).post(courseValidation(), createCourse);

router
  .route("/:id")
  .get(getCourse)
  .patch(courseValidation(), updateCourse)
  .delete(deleteCourse);

module.exports = router;
