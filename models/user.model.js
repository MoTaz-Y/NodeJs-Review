const mongoose = require("mongoose");
const validator = require("validator");
const userRole = require("../utils/usersRole");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRole.ADMIN, userRole.USER, userRole.MANAGER],
    default: userRole.USER,
  },

  avatar: {
    type: String,
    default: "uploads/profile.webp",
  },
});

module.exports = mongoose.model("User", userSchema);
