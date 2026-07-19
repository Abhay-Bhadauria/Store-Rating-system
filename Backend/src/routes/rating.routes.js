const express = require("express");
const ratingController = require("../controllers/rating.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.get("/my", ratingController.getMyRatings);

router.post("/", ratingController.submitRating);
router.patch("/:id", ratingController.updateRating);

module.exports = router;
