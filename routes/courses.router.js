const express = require("express");
const router = express.Router();
const courseValidation = require("../middlewares/coursesValidation");
const allowedTo = require("../middlewares/allowedTo");
const userRole = require("../utils/usersRole");
const verifyToken = require("../middlewares/verifyToken");
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses.controller");

router
  .route("/")
  .get(verifyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), getAllCourses)
  .post(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.MANAGER, userRole.USER),
    courseValidation(),
    createCourse
  );

router
  .route("/:id")
  .get(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.MANAGER, userRole.USER),
    getCourse
  )
  .patch(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.MANAGER, userRole.USER),
    courseValidation(),
    updateCourse
  )
  .delete(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.MANAGER, userRole.USER),
    deleteCourse
  );

module.exports = router;
