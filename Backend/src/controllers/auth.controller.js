const authService = require("../services/auth.service");

const sendSuccess = (res, statusCode, message, data = null) => {
  const response = { success: true, message };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, errors = null) => {
  const response = { success: false, message };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const handleServiceError = (res, error) => {
  if (error instanceof authService.AppError) {
    return sendError(res, error.statusCode, error.message);
  }

  console.error("Auth controller error:", error);
  return sendError(res, 500, "Internal server error");
};

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    return sendSuccess(res, 201, "User registered successfully", result);
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    return sendSuccess(res, 200, "Login successful", result);
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.updatePassword({
      authorizationHeader: req.headers.authorization,
      currentPassword,
      newPassword,
    });

    return sendSuccess(res, 200, result.message);
  } catch (error) {
    return handleServiceError(res, error);
  }
};

module.exports = {
  register,
  login,
  updatePassword,
  sendError,
};
