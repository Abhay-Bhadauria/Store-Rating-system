const { validationResult } = require("express-validator");
const { AppError } = require("../services/auth.service");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationError = new Error("Validation failed");
    validationError.statusCode = 400;
    validationError.errors = errors.array();
    return next(validationError);
  }

  return next();
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Authentication token has expired",
    });
  }

  if (err.name === "NotBeforeError") {
    return res.status(401).json({
      success: false,
      message: "Authentication token is not active yet",
    });
  }

  if (err.statusCode === 400 && Array.isArray(err.errors)) {
    return res.status(400).json({
      success: false,
      message: err.message || "Validation failed",
      errors: err.errors,
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors?.[0]?.path || "field";

    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors.map((error) => ({
        field: error.path,
        message: error.message,
      })),
    });
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      success: false,
      message: "Related record does not exist",
    });
  }

  if (err.name === "SequelizeDatabaseError") {
    return res.status(400).json({
      success: false,
      message: "Database operation failed",
    });
  }

  console.error("Unhandled error:", err);

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
};

module.exports = {
  errorHandler,
  handleValidationErrors,
};
