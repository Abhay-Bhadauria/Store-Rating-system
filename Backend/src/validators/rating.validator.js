const { body, param } = require("express-validator");

const ratingValidator = body("rating")
  .notEmpty()
  .withMessage("Rating is required")
  .isInt({ min: 1, max: 5 })
  .withMessage("Rating must be an integer between 1 and 5");

const submitRatingValidator = [
  body("store_id")
    .notEmpty()
    .withMessage("Store is required")
    .isInt({ min: 1 })
    .withMessage("Store must be a valid store ID"),
  ratingValidator,
];

const updateRatingValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("A valid rating ID is required"),
  ratingValidator,
];

module.exports = {
  submitRatingValidator,
  updateRatingValidator,
};
