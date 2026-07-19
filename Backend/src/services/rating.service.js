const { Rating, Store } = require("../models");
const { AppError } = require("./auth.service");

const validateRatingValue = (rating) => {
  const parsedRating = Number(rating);

  if (
    !Number.isInteger(parsedRating) ||
    parsedRating < 1 ||
    parsedRating > 5
  ) {
    throw new AppError("Rating must be an integer between 1 and 5", 400);
  }

  return parsedRating;
};

const validateStoreId = (storeId) => {
  const parsedStoreId = Number(storeId);

  if (!storeId || Number.isNaN(parsedStoreId)) {
    throw new AppError("A valid store is required", 400);
  }

  return parsedStoreId;
};

const formatRating = (rating) => rating.get({ plain: true });

const ensureStoreExists = async (storeId) => {
  const store = await Store.findByPk(storeId, {
    attributes: ["id", "name"],
  });

  if (!store) {
    throw new AppError("Store not found", 404);
  }

  return store;
};

const submitRating = async (userId, { store_id, rating }) => {
  const storeId = validateStoreId(store_id);
  const ratingValue = validateRatingValue(rating);

  await ensureStoreExists(storeId);

  const existingRating = await Rating.findOne({
    where: {
      user_id: userId,
      store_id: storeId,
    },
  });

  if (existingRating) {
    existingRating.rating = ratingValue;
    await existingRating.save();

    return {
      rating: formatRating(existingRating),
      isUpdate: true,
    };
  }

  try {
    const newRating = await Rating.create({
      user_id: userId,
      store_id: storeId,
      rating: ratingValue,
    });

    return {
      rating: formatRating(newRating),
      isUpdate: false,
    };
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new AppError("Store not found", 404);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      const ratingRecord = await Rating.findOne({
        where: { user_id: userId, store_id: storeId },
      });

      if (ratingRecord) {
        ratingRecord.rating = ratingValue;
        await ratingRecord.save();

        return {
          rating: formatRating(ratingRecord),
          isUpdate: true,
        };
      }
    }

    throw error;
  }
};

const updateRating = async (userId, ratingId, { rating }) => {
  const parsedRatingId = Number(ratingId);

  if (!ratingId || Number.isNaN(parsedRatingId)) {
    throw new AppError("A valid rating is required", 400);
  }

  const ratingValue = validateRatingValue(rating);

  const existingRating = await Rating.findOne({
    where: {
      id: parsedRatingId,
      user_id: userId,
    },
  });

  if (!existingRating) {
    throw new AppError("Rating not found", 404);
  }

  existingRating.rating = ratingValue;
  await existingRating.save();

  return {
    rating: formatRating(existingRating),
  };
};

const getMyRatings = async (userId) => {
  const ratings = await Rating.findAll({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: Store,
        as: "store",
        attributes: ["id", "name", "email", "address"],
      },
    ],
    order: [["updated_at", "DESC"]],
  });

  return ratings.map((rating) => ({
    id: rating.id,
    rating: rating.rating,
    created_at: rating.created_at,
    updated_at: rating.updated_at,
    store: rating.store,
  }));
};
module.exports = {
  submitRating,
  updateRating,
  getMyRatings,
};
