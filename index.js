const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const coursesRoutes = require("./routes/courses.router");
const usersRoutes = require("./routes/users.router");
const httpStatus = require("./utils/httpStatus");
const httpStatusText = require("./utils/httpStatusText");
const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URL;
const cors = require("cors");
const errorHandler = require("./utils/errorHandler");
const path = require("path");

mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
app.use(cors());
app.use(express.json());
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/courses", coursesRoutes);
app.use("/api/users", usersRoutes);
app.use((req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    status: "fail",
    message: httpStatusText.NOT_FOUND,
  });
});
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
