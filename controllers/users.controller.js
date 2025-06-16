const AppError = require("../utils/AppError");
const httpStatsus = require("../utils/httpStatus");
const httpStatsusText = require("../utils/httpStatusText");
const User = require("../models/user.model");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;
  const users = await User.find().skip(skip).limit(limit);
  if (!users) {
    const error = AppError.create(
      httpStatsus.NOT_FOUND || 404,
      "Users not found",
      httpStatsusText.NOT_FOUND || "not found"
    );
    return next(error);
  }
  return res.status(httpStatsus.SUCCESS).json({
    status: httpStatsusText.SUCCESS,
    data: {
      users,
    },
  });
});

const getUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    const error = AppError.create(
      httpStatsus.NOT_FOUND,
      "User not found",
      httpStatsusText.NOT_FOUND
    );
    return next(error);
  }
  return res.status(httpStatsus.SUCCESS).json({
    status: httpStatsusText.SUCCESS,
    data: {
      user,
    },
  });
});
const deleteUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    const error = AppError.create(
      httpStatsus.NOT_FOUND,
      "User not found",
      httpStatsusText.NOT_FOUND
    );
    return next(error);
  } else {
    await User.findByIdAndDelete(id);
    return res.status(httpStatsus.SUCCESS).json({
      status: httpStatsusText.SUCCESS,
      data: {
        user,
      },
    });
  }
});

module.exports = {
  getAllUsers,
  getUser,
  deleteUser,
};
