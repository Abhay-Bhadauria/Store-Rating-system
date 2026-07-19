const { query, param } = require("express-validator");

const nameSearchValidator = query("name")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Name search cannot be empty")
  .isLength({ max: 150 })
  .withMessage("Name search must not exceed 150 characters");

const addressSearchValidator = query("address")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Address search cannot be empty");

const ratingFilterValidator = (field, label) =>
  query(field)
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage(`${label} must be a number between 1 and 5`)
    .toFloat();

const listStoresQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  nameSearchValidator,
  addressSearchValidator,
  ratingFilterValidator("minAverageRating", "Minimum average rating"),
  ratingFilterValidator("maxAverageRating", "Maximum average rating"),
  query("userRated")
    .optional()
    .isIn(["true", "false"])
    .withMessage("userRated must be true or false"),
  query("sortBy")
    .optional()
    .isIn(["name", "email", "created_at", "averageRating"])
    .withMessage("Sort by must be name, email, created_at, or averageRating"),
  query("sortOrder")
    .optional()
    .isIn(["ASC", "DESC", "asc", "desc"])
    .withMessage("Sort order must be ASC or DESC"),
];

const storeIdParamValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("A valid store ID is required"),
];

module.exports = {
  listStoresQueryValidator,
  storeIdParamValidator,
};
