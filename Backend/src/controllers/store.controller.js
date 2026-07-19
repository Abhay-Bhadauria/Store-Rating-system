const storeService = require("../services/store.service");
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

  console.error("Store controller error:", error);
  return sendError(res, 500, "Internal server error");
};

const getStores = async (req, res) => {
  try {
    const result = await storeService.getStores(req.query, req.user.id);
    return sendSuccess(res, 200, "Stores fetched successfully", result);
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await storeService.getStoreById(req.params.id, req.user.id);
    return sendSuccess(res, 200, "Store details fetched successfully", { store });
  } catch (error) {
    return handleServiceError(res, error);
  }
};

module.exports = {
  getStores,
  getStoreById,
};
