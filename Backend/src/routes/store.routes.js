const express = require("express");
const storeController = require("../controllers/store.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/", storeController.getStores);
router.get("/:id", storeController.getStoreById);

module.exports = router;
