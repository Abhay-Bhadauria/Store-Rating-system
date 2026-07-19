const express = require("express");
const { validationResult } = require("express-validator");
const authController = require("../controllers/auth.controller");
const {
  registerValidator,
  loginValidator,
  updatePasswordValidator,
} = require("../validators/auth.validator");

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return authController.sendError(res, 400, "Validation failed", errors.array());
  }

  return next();
};

router.post("/register", registerValidator, validateRequest, authController.register);
router.post("/login", loginValidator, validateRequest, authController.login);
router.patch(
  "/password",
  updatePasswordValidator,
  validateRequest,
  authController.updatePassword,
);

module.exports = router;
