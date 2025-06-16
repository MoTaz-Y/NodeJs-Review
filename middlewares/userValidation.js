const { body } = require("express-validator");

module.exports = () => {
  return [
    body("fname").notEmpty().withMessage("First name is required"),
    body("lname").notEmpty().withMessage("Last name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role").notEmpty().withMessage("Role is required"),
  ];
};
