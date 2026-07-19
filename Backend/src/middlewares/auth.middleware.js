const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { AppError } = require("../services/auth.service");

const authenticate = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication token is required", 401);
    }

    const token = authorizationHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      throw new AppError("JWT secret is not configured", 500);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      throw new AppError("Invalid or expired authentication token", 401);
    }

    req.user = user.get({ plain: true });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
};
