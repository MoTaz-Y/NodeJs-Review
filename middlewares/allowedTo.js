const httpStatsus = require("../utils/httpStatus");
const AppError = require("../utils/AppError");
const httpStatsusText = require("../utils/httpStatusText");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = AppError.create(
        httpStatsus.UNAUTHORIZED,
        "You are not authorized to access this route",
        httpStatsusText.UNAUTHORIZED
      );
      return next(error);
    }
    next();
  };
};
