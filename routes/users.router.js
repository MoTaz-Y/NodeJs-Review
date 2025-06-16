const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const userRole = require("../utils/usersRole");
const allowedTo = require("../middlewares/allowedTo");
const router = express.Router();
const multer = require("multer");
const {
  getAllUsers,
  getUser,
  deleteUser,
} = require("../controllers/users.controller");
const userValidation = require("../middlewares/userValidation");
const AppError = require("../utils/AppError");
const httpStatus = require("../utils/httpStatus");
const httpStatusText = require("../utils/httpStatusText");
const { registerUser, loginUser } = require("../controllers/user.auth");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(
      AppError.create(
        httpStatus.BAD_REQUEST,
        "Only image files are allowed!",
        httpStatusText.BAD_REQUEST
      ),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

router
  .route("/")
  .get(verifyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), getAllUsers);
router
  .route("/:id")
  .get(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.MANAGER, userRole.USER),
    getUser
  )
  .delete(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.MANAGER, userRole.USER),
    deleteUser
  );
router
  .route("/register")
  .post(upload.single("avatar"), userValidation(), registerUser);

router.route("/login").post(userValidation(), loginUser);

module.exports = router;
