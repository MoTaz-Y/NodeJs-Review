const httpStatsus = require("./httpStatus");
const httpStatsusText = require("./httpStatusText");
class AppError extends Error {
  constructor(message, statusCode, statusText) {
    super();
  }
  create(statusCode, message, statusText) {
    this.statusCode = statusCode || httpStatsus.INTERNAL_SERVER_ERROR;
    this.message = message;
    this.statusText = statusText || httpStatsusText[statusCode];
    return this;
  }
}
module.exports = new AppError();
