const httpStatsus = require("../utils/httpStatus");
const httpStatsusText = require("../utils/httpStatusText");
const Course = require("../models/course.models");
const { validationResult } = require("express-validator");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/AppError");

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find().skip(skip).limit(limit);
  if (!courses) {
    const error = AppError.create(
      httpStatsus.NOT_FOUND || 404,
      "Courses not found",
      httpStatsusText.NOT_FOUND || "not found"
    );
    return next(error);
  }
  return res.status(httpStatsus.SUCCESS).json({
    status: httpStatsusText.SUCCESS,
    data: {
      courses,
    },
  });
});

const getCourse = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    const error = AppError.create(
      httpStatsus.NOT_FOUND || 404,
      "Course not found",
      httpStatsusText.NOT_FOUND || "not found"
    );
    return next(error);
  } else {
    return res.status(httpStatsus.SUCCESS).json({
      status: httpStatsusText.SUCCESS,
      data: {
        course,
      },
    });
  }
});

const createCourse = asyncWrapper(async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const errors = AppError.create(
      httpStatsus.BAD_REQUEST,
      error.array(),
      httpStatsusText.BAD_REQUEST
    );
    return next(errors);
  }
  const { title, price } = req.body;
  const newCourse = await Course.create({
    title,
    price,
  });

  return res.status(httpStatsus.SUCCESS).json({
    status: httpStatsusText.SUCCESS,
    data: {
      course: newCourse,
    },
  });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    const error = AppError.create(
      httpStatsus.NOT_FOUND,
      "Course not found",
      httpStatsusText.NOT_FOUND
    );
    return next(error);
  } else {
    const updateCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(httpStatsus.SUCCESS).json({
      status: httpStatsusText.SUCCESS,
      data: {
        updateCourse,
      },
    });
  }
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    const error = AppError.create(
      httpStatsus.NOT_FOUND,
      "Course not found",
      httpStatsusText.NOT_FOUND
    );
    return next(error);
  } else {
    await Course.findByIdAndDelete(id);
    return res.status(httpStatsus.SUCCESS).json({
      status: httpStatsusText.SUCCESS,
      data: {
        course,
      },
    });
  }
});

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
