const User = require("../models/user.model");
const httpStatsus = require("../utils/httpStatus");
const httpStatsusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/AppError");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");

const registerUser = asyncWrapper(async (req, res) => {
  const error = validationResult(req);
  console.log(error, "error");
  if (!error.isEmpty()) {
    console.log("================================error");
    const errors = AppError.create(
      httpStatsus.BAD_REQUEST,
      error.array(),
      httpStatsusText.BAD_REQUEST
    );
    return next(errors);
  }
  console.log("req.body");
  const { fname, lname, email, password, role } = req.body;
  console.log(req.body, "req.body");
  const userExists = await User.findOne({ email });
  console.log(userExists, "userExists");
  if (userExists) {
    const error = AppError.create(
      httpStatsus.BAD_REQUEST,
      "User already exists",
      httpStatsusText.BAD_REQUEST
    );
    return next(error);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    fname,
    lname,
    email,
    password: hashedPassword,
    role, 
    avatar: req.file.filename,
  });
  const token = await generateJWT({
    _id: user._id,
    email: user.email,
    role: user.role,
  });
  user.token = token;
  await user.save();
  return res.status(httpStatsus.SUCCESS).json({
    status: httpStatsusText.SUCCESS,
    data: {
      user,
    },
  });
});

const loginUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = AppError.create(
      httpStatsus.UNAUTHORIZED,
      "Invalid credentials",
      httpStatsusText.UNAUTHORIZED
    );
    return next(error);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = AppError.create(
      httpStatsus.UNAUTHORIZED,
      "Invalid credentials",
      httpStatsusText.UNAUTHORIZED
    );
    return next(error);
  }
  const token = await generateJWT({
    _id: user._id,
    email: user.email,
    role: user.role,
  });
  user.token = token;
  await user.save();
  return res.status(httpStatsus.SUCCESS).json({
    status: httpStatsusText.SUCCESS,
    data: {
      token,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
};
