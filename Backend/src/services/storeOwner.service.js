const sequelize = require("../config/db");
const { User, Store, Rating } = require("../models");
const { AppError } = require("./auth.service");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const parsePagination = (query) => {
  const page = Math.max(Number(query.page) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(Number(query.limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const buildPaginationMeta = (page, limit, totalItems) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.ceil(totalItems / limit) || 0,
});

const getOwnedStore = async (ownerId) => {
  const store = await Store.findOne({
    where: { owner_id: ownerId },
    attributes: ["id", "name", "email", "address", "created_at", "updated_at"],
  });

  if (!store) {
    throw new AppError("No store is assigned to this store owner", 404);
  }

  return store;
};

const getStoreRatingStats = async (storeId) => {
  const ratingStats = await Rating.findOne({
    where: { store_id: storeId },
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("id")), "totalRatings"],
      [sequelize.fn("AVG", sequelize.col("rating")), "averageRating"],
    ],
    raw: true,
  });

  return {
    totalRatings: Number(ratingStats?.totalRatings || 0),
    averageRating: ratingStats?.averageRating
      ? Number(Number(ratingStats.averageRating).toFixed(2))
      : null,
  };
};

const getDashboard = async (ownerId) => {
  const store = await getOwnedStore(ownerId);
  const ratingStats = await getStoreRatingStats(store.id);

  return {
    store: store.get({ plain: true }),
    averageRating: ratingStats.averageRating,
    totalRatings: ratingStats.totalRatings,
  };
};

const getStoreRaters = async (ownerId, query) => {
  const store = await getOwnedStore(ownerId);
  const { page, limit, offset } = parsePagination(query);

  const { rows, count } = await Rating.findAndCountAll({
    where: { store_id: store.id },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "address"],
      },
    ],
    order: [["created_at", "DESC"]],
    limit,
    offset,
  });

  return {
    store: {
      id: store.id,
      name: store.name,
    },
    raters: rows.map((rating) => ({
      ratingId: rating.id,
      rating: rating.rating,
      ratedAt: rating.created_at,
      user: rating.user.get({ plain: true }),
    })),
    pagination: buildPaginationMeta(page, limit, count),
  };
};

module.exports = {
  getDashboard,
  getStoreRaters,
};
