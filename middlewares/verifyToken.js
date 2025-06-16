const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const httpStatsus = require("../utils/httpStatus");
const httpStatsusText = require("../utils/httpStatusText");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    const error = AppError.create(
      httpStatsus.UNAUTHORIZED,
      "Token not found",
      httpStatsusText.UNAUTHORIZED
    );
    return next(error);
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      const error = AppError.create(
        httpStatsus.UNAUTHORIZED,
        "Invalid token",
        httpStatsusText.UNAUTHORIZED
      );
      return next(error);
    }
    req.user = user; // add user to req object to use it in other middlewares like allowedTo
    next();
  });
};

module.exports = verifyToken;
