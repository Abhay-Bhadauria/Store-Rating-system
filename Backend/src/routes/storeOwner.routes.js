const express = require("express");
const storeOwnerController = require("../controllers/storeOwner.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const router = express.Router();

router.use(authenticate, authorize("store_owner"));

router.get("/dashboard", storeOwnerController.getDashboard);
router.get("/raters", storeOwnerController.getStoreRaters);

module.exports = router;
