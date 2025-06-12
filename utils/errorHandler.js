const httpStatsus = require("./httpStatus");
const httpStatsusText = require("./httpStatusText");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || httpStatsus.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    status: err.statusText || httpStatsusText[statusCode],
    message: err.message,
    code: err.statusCode || httpStatsus[statusCode],
  });
};
module.exports = errorHandler;
