const { body, param, query } = require("express-validator");

const userNameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required")
  .isLength({ max: 100 })
  .withMessage("Name must not exceed 100 characters");

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
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long");

const addressValidator = body("address")
  .trim()
  .notEmpty()
  .withMessage("Address is required");

const storeNameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("Store name is required")
  .isLength({ max: 150 })
  .withMessage("Store name must not exceed 150 characters");

const storeEmailValidator = body("email")
  .trim()
  .notEmpty()
  .withMessage("Store email is required")
  .isEmail()
  .withMessage("A valid store email address is required")
  .isLength({ max: 255 })
  .withMessage("Store email must not exceed 255 characters")
  .normalizeEmail();

const storeAddressValidator = body("address")
  .trim()
  .notEmpty()
  .withMessage("Store address is required");

const createUserValidator = [
  userNameValidator,
  emailValidator,
  passwordValidator,
  addressValidator,
  body("role")
    .optional()
    .isIn(["admin", "normal_user", "store_owner"])
    .withMessage("Role must be admin, normal_user, or store_owner"),
];

const createStoreValidator = [
  storeNameValidator,
  storeEmailValidator,
  storeAddressValidator,
  body("owner_id")
    .notEmpty()
    .withMessage("Store owner is required")
    .isInt({ min: 1 })
    .withMessage("Store owner must be a valid user ID"),
];

const userIdParamValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("A valid user ID is required"),
];

const storeIdParamValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("A valid store ID is required"),
];

const listUsersQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Search term cannot be empty"),
  query("sortBy")
    .optional()
    .isIn(["name", "email", "role", "created_at"])
    .withMessage("Sort by must be name, email, role, or created_at"),
  query("sortOrder")
    .optional()
    .isIn(["ASC", "DESC", "asc", "desc"])
    .withMessage("Sort order must be ASC or DESC"),
];

const listStoresQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Search term cannot be empty"),
  query("sortBy")
    .optional()
    .isIn(["name", "email", "created_at"])
    .withMessage("Sort by must be name, email, or created_at"),
  query("sortOrder")
    .optional()
    .isIn(["ASC", "DESC", "asc", "desc"])
    .withMessage("Sort order must be ASC or DESC"),
];

module.exports = {
  createUserValidator,
  createStoreValidator,
  userIdParamValidator,
  storeIdParamValidator,
  listUsersQueryValidator,
  listStoresQueryValidator,
};
