const { Op } = require("sequelize");
const sequelize = require("../config/db");
const { Store } = require("../models");
const { AppError } = require("./auth.service");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const SORT_FIELDS = {
  name: "name",
  email: "email",
  created_at: "created_at",
  averageRating: "averageRating",
};

const parseListOptions = (query) => {
  const page = Math.max(Number(query.page) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(Number(query.limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const offset = (page - 1) * limit;
  const sortBy = SORT_FIELDS[query.sortBy] ? query.sortBy : "created_at";
  const sortOrder = query.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  return { page, limit, offset, sortBy, sortOrder };
};

const buildAverageRatingSubquery = () =>
  sequelize.literal(`(
    SELECT AVG(r.rating)
    FROM ratings r
    WHERE r.store_id = "stores".id
  )`);

const buildWhereClause = (query, userId) => {
  const conditions = [];

  if (query.name?.trim()) {
    conditions.push({
      name: { [Op.iLike]: `%${query.name.trim()}%` },
    });
  }

  if (query.address?.trim()) {
    conditions.push({
      address: { [Op.iLike]: `%${query.address.trim()}%` },
    });
  }

  if (query.minAverageRating !== undefined && query.minAverageRating !== "") {
    const minAverageRating = Number(query.minAverageRating);

    if (!Number.isNaN(minAverageRating)) {
      conditions.push(
        sequelize.where(buildAverageRatingSubquery(), {
          [Op.gte]: minAverageRating,
        }),
      );
    }
  }

  if (query.maxAverageRating !== undefined && query.maxAverageRating !== "") {
    const maxAverageRating = Number(query.maxAverageRating);

    if (!Number.isNaN(maxAverageRating)) {
      conditions.push(
        sequelize.where(buildAverageRatingSubquery(), {
          [Op.lte]: maxAverageRating,
        }),
      );
    }
  }

  if (query.userRated === "true") {
    conditions.push(
      sequelize.literal(`EXISTS (
        SELECT 1
        FROM ratings r
        WHERE r.store_id = "stores".id
          AND r.user_id = ${parseInt(userId, 10)}
      )`),
    );
  }

  if (query.userRated === "false") {
    conditions.push(
      sequelize.literal(`NOT EXISTS (
        SELECT 1
        FROM ratings r
        WHERE r.store_id = "Store".id
          AND r.user_id = ${parseInt(userId, 10)}
      )`),
    );
  }

  return conditions.length ? { [Op.and]: conditions } : {};
};

const buildOrderClause = (sortBy, sortOrder) => {
  if (sortBy === "averageRating") {
    return [[buildAverageRatingSubquery(), sortOrder]];
  }

  return [[sortBy, sortOrder]];
};

const buildPaginationMeta = (page, limit, totalItems) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.ceil(totalItems / limit) || 0,
});

const formatRatingValue = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  return Number(Number(value).toFixed(2));
};

const formatStoreRecord = (store) => {
  const plainStore = store.get({ plain: true });

  return {
    id: plainStore.id,
    name: plainStore.name,
    email: plainStore.email,
    address: plainStore.address,
    created_at: plainStore.created_at,
    updated_at: plainStore.updated_at,
    averageRating: formatRatingValue(plainStore.averageRating),
    totalRatings: Number(plainStore.totalRatings || 0),
    userRating:
      plainStore.userRating === null || plainStore.userRating === undefined
        ? null
        : Number(plainStore.userRating),
  };
};

const getRatingAttributes = (userId) => [
  [
    sequelize.literal(`(
      SELECT ROUND(AVG(r.rating)::numeric, 2)
      FROM ratings r
      WHERE r.store_id = "Store".id
    )`),
    "averageRating",
  ],
  [
    sequelize.literal(`(
      SELECT COUNT(r.id)::int
      FROM ratings r
      WHERE r.store_id = "Store".id
    )`),
    "totalRatings",
  ],
  [
    sequelize.literal(`(
      SELECT r.rating
      FROM ratings r
      WHERE r.store_id =  "Store".id
        AND r.user_id = ${parseInt(userId, 10)}
      LIMIT 1
    )`),
    "userRating",
  ],
];

const getStores = async (query, userId) => {
  const { page, limit, offset, sortBy, sortOrder } = parseListOptions(query);
  const where = buildWhereClause(query, userId);

  const { rows, count } = await Store.findAndCountAll({
    where,
    attributes: {
      include: getRatingAttributes(userId),
    },
    order: buildOrderClause(sortBy, sortOrder),
    limit,
    offset,
  });

  return {
    stores: rows.map(formatStoreRecord),
    pagination: buildPaginationMeta(page, limit, count),
  };
};

const getStoreById = async (storeId, userId) => {
  const store = await Store.findByPk(storeId, {
    attributes: {
      include: getRatingAttributes(userId),
    },
  });

  if (!store) {
    throw new AppError("Store not found", 404);
  }

  return formatStoreRecord(store);
};

module.exports = {
  getStores,
  getStoreById,
};
