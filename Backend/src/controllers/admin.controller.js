const adminService = require("../services/admin.service");
const { AppError } = require("../services/auth.service");

const sendSuccess = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };

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

  console.error("Admin controller error:", error);
  return sendError(res, 500, "Internal server error");
};

// ================= Dashboard =================

const getDashboard = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();

    return sendSuccess(
      res,
      200,
      "Dashboard statistics fetched successfully",
      stats
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

// ================= Users =================

const createUser = async (req, res) => {
  try {
    const user = await adminService.createUser(req.body);

    return sendSuccess(
      res,
      201,
      "User created successfully",
      { user }
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await adminService.getUsers(req.query);

    return sendSuccess(
      res,
      200,
      "Users fetched successfully",
      result
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.id);

    return sendSuccess(
      res,
      200,
      "User details fetched successfully",
      { user }
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await adminService.updateUser(
      req.params.id,
      req.body
    );

    return sendSuccess(
      res,
      200,
      "User updated successfully",
      { user }
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    await adminService.deleteUser(req.params.id);

    return sendSuccess(
      res,
      200,
      "User deleted successfully"
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

// ================= Stores =================

const createStore = async (req, res) => {
  try {
    const store = await adminService.createStore(req.body);

    return sendSuccess(
      res,
      201,
      "Store created successfully",
      { store }
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const getStores = async (req, res) => {
  try {
    const result = await adminService.getStores(req.query);

    return sendSuccess(
      res,
      200,
      "Stores fetched successfully",
      result
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await adminService.getStoreById(req.params.id);

    return sendSuccess(
      res,
      200,
      "Store details fetched successfully",
      { store }
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const updateStore = async (req, res) => {
  try {
    const store = await adminService.updateStore(
      req.params.id,
      req.body
    );

    return sendSuccess(
      res,
      200,
      "Store updated successfully",
      { store }
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const deleteStore = async (req, res) => {
  try {
    await adminService.deleteStore(req.params.id);

    return sendSuccess(
      res,
      200,
      "Store deleted successfully"
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

module.exports = {
  getDashboard,

  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,

  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
};