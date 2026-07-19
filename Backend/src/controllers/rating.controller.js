const ratingService = require("../services/rating.service");
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

  console.error("Rating controller error:", error);
  return sendError(res, 500, "Internal server error");
};

const submitRating = async (req, res) => {
  try {
    const result = await ratingService.submitRating(req.user.id, req.body);

    if (result.isUpdate) {
      return sendSuccess(res, 200, "Rating updated successfully", {
        rating: result.rating,
      });
    }

    return sendSuccess(res, 201, "Rating submitted successfully", {
      rating: result.rating,
    });
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const updateRating = async (req, res) => {
  try {
    const result = await ratingService.updateRating(
      req.user.id,
      req.params.id,
      req.body,
    );

    return sendSuccess(res, 200, "Rating updated successfully", result);
  } catch (error) {
    return handleServiceError(res, error);
  }
};

const getMyRatings = async (req, res) => {
  try {
    const ratings = await ratingService.getMyRatings(req.user.id);

    return sendSuccess(
      res,
      200,
      "Ratings fetched successfully",
      {
        ratings,
      }
    );
  } catch (error) {
    return handleServiceError(res, error);
  }
};

module.exports = {
  submitRating,
  updateRating,
  getMyRatings,
};
