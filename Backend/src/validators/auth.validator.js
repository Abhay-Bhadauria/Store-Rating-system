const { body } = require("express-validator");

const nameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required")
  .isLength({ min: 2, max: 60 })
  .withMessage("Name must be between 2 and 60 characters");

const emailValidator = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("A valid email address is required")
  .isLength({ max: 255 })
  .withMessage("Email must not exceed 255 characters")
  .normalizeEmail();

  const passwordValidator = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8, max: 16 })
  .withMessage("Password must be between 8 and 16 characters")
  .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/)
  .withMessage(
    "Password must contain at least one uppercase letter and one special character"
  );

  const addressValidator = body("address")
  .trim()
  .notEmpty()
  .withMessage("Address is required")
  .isLength({ max: 400 })
  .withMessage("Address must not exceed 400 characters");

const registerValidator = [nameValidator, emailValidator, passwordValidator, addressValidator];

const loginValidator = [emailValidator, body("password").notEmpty().withMessage("Password is required")];

const updatePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password confirmation does not match new password");
      }

      return true;
    }),
];

module.exports = {
  registerValidator,
  loginValidator,
  updatePasswordValidator,
};
