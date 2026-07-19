const express = require("express");
const adminController = require("../controllers/admin.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

// Protect all admin routes
router.use(authenticate, authorize("admin"));

// Dashboard
router.get("/dashboard", adminController.getDashboard);

// ==================== USERS ====================

// Create User
router.post("/users", adminController.createUser);

// Get All Users
router.get("/users", adminController.getUsers);

// Get Single User
router.get("/users/:id", adminController.getUserById);

// Update User
router.put("/users/:id", adminController.updateUser);

// Delete User
router.delete("/users/:id", adminController.deleteUser);

// ==================== STORES ====================

// Create Store
router.post("/stores", adminController.createStore);

// Get All Stores
router.get("/stores", adminController.getStores);

// Get Single Store
router.get("/stores/:id", adminController.getStoreById);

// Update Store
router.put("/stores/:id", adminController.updateStore);

// Delete Store
router.delete("/stores/:id", adminController.deleteStore);

module.exports = router;