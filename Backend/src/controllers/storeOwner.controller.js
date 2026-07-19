const storeOwnerService = require("../services/storeOwner.service");
const { AppError } = require("../services/auth.service");

const sendSuccess = (res, statusCode, message, data = null) => {
  const response = { success: true, message };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message) =>
  res.status(statusCode).json({
    success: false,
    message,
  });

const handleServiceError = (res, error) => {
  if (error instanceof AppError) {
    return sendError(res, error.statusCode, error.message);
  }

  console.error("Store owner controller error:", error);
  return sendError(res, 500, "Internal server error");
};

const getDashboard = async (req, res) => {
  try {
    const dashboard = await storeOwnerService.getDashboard(req.user.id);
    return sendSuccess(
      res,
      200,
      "Store owner dashboard fetched successfully",
      dashboard,
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const getStoreRaters = async (req, res) => {
  try {
    const result = await storeOwnerService.getStoreRaters(req.user.id, req.query);
    return sendSuccess(res, 200, "Store raters fetched successfully", result);
  } catch (error) {
    return handleServiceError(res, error);
  }
};

module.exports = {
  getDashboard,
  getStoreRaters,
};
