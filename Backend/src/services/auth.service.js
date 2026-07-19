const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const formatUser = (user) => {
  const { password_hash: _passwordHash, ...safeUser } = user.get({ plain: true });
  return safeUser;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT secret is not configured", 500);
  }

  return secret;
};

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

const hashPassword = async (password) => bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

const extractBearerToken = (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication token is required", 401);
  }

  return authorizationHeader.split(" ")[1];
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    throw new AppError("Invalid or expired authentication token", 401);
  }
};

const registerUser = async ({ name, email, password, address }) => {
  if (!name?.trim()) {
    throw new AppError("Name is required", 400);
  }

  if (!email?.trim()) {
    throw new AppError("Email is required", 400);
  }

  if (!address?.trim()) {
    throw new AppError("Address is required", 400);
  }

  if (!password) {
    throw new AppError("Password is required", 400);
  }

  if (password.length < 8) {
    throw new AppError(
      "Password must be at least 8 characters long",
      400
    );
  }

  try {
    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
      address: address.trim(),
      role: "normal_user",
    });

    const token = generateToken(user);

    return {
      user: formatUser(user),
      token,
    };
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError("Email is already registered", 409);
    }

    throw error;
  }
};
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user);

  return {
    user: formatUser(user),
    token,
  };
};

const updatePassword = async ({
  authorizationHeader,
  currentPassword,
  newPassword,
}) => {
  const token = extractBearerToken(authorizationHeader);
  const decoded = verifyToken(token);

  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new AppError("Invalid or expired authentication token", 401);
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password_hash,
  );

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", 401);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from the current password",
      400,
    );
  }

  user.password_hash = await hashPassword(newPassword);
  await user.save();

  return {
    message: "Password updated successfully",
  };
};

module.exports = {
  registerUser,
  loginUser,
  updatePassword,
  AppError,
};
