const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const sequelize = require("../config/db");
const { User, Store, Rating } = require("../models");
const { AppError } = require("./auth.service");

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const VALID_ROLES = ["admin", "normal_user", "store_owner"];
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const USER_SORT_FIELDS = {
  name: "name",
  email: "email",
  role: "role",
  created_at: "created_at",
};

const STORE_SORT_FIELDS = {
  name: "name",
  email: "email",
  created_at: "created_at",
};

const formatUser = (user) => {
  const { password_hash: _passwordHash, ...safeUser } = user.get({ plain: true });
  return safeUser;
};

const parseListOptions = (query, allowedSortFields, defaultSortBy) => {
  const page = Math.max(Number(query.page) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(Number(query.limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const offset = (page - 1) * limit;
  const search = query.search?.trim() || "";
  const sortBy = allowedSortFields[query.sortBy] ? query.sortBy : defaultSortBy;
  const sortOrder = query.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  return { page, limit, offset, search, sortBy, sortOrder };
};

const buildSearchCondition = (search) => {
  if (!search) {
    return {};
  }

  const normalizedSearch = search.trim().toLowerCase();

  return {
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { address: { [Op.iLike]: `%${search}%` } },
      ...(VALID_ROLES.includes(normalizedSearch)
        ? [{ role: normalizedSearch }]
        : []),
    ],
  };
};
const buildPaginationMeta = (page, limit, totalItems) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.ceil(totalItems / limit) || 0,
});

const validateCreateUserInput = ({ name, email, password, address, role }) => {
  if (!name?.trim()) {
    throw new AppError("Name is required", 400);
  }

  if (!email?.trim()) {
    throw new AppError("Email is required", 400);
  }

  if (!password) {
    throw new AppError("Password is required", 400);
  }

  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters long", 400);
  }

  if (!address?.trim()) {
    throw new AppError("Address is required", 400);
  }

  const userRole = role || "normal_user";

  if (!VALID_ROLES.includes(userRole)) {
    throw new AppError("Invalid role", 400);
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    address: address.trim(),
    role: userRole,
  };
};

const validateCreateStoreInput = ({ name, email, address, owner_id }) => {
  if (!name?.trim()) {
    throw new AppError("Store name is required", 400);
  }

  if (!email?.trim()) {
    throw new AppError("Store email is required", 400);
  }

  if (!address?.trim()) {
    throw new AppError("Store address is required", 400);
  }

  if (!owner_id) {
    throw new AppError("Store owner is required", 400);
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    address: address.trim(),
    owner_id: Number(owner_id),
  };
};

const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.count(),
    Store.count(),
    Rating.count(),
  ]);

  return {
    totalUsers,
    totalStores,
    totalRatings,
  };
};

const createUser = async (payload) => {
  const validatedInput = validateCreateUserInput(payload);

  try {
    const passwordHash = await bcrypt.hash(
      validatedInput.password,
      BCRYPT_SALT_ROUNDS,
    );

    const user = await User.create({
      name: validatedInput.name,
      email: validatedInput.email,
      password_hash: passwordHash,
      address: validatedInput.address,
      role: validatedInput.role,
    });

    return formatUser(user);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError("Email is already registered", 409);
    }

    throw error;
  }
};

const getUsers = async (query) => {
  const { page, limit, offset, search, sortBy, sortOrder } = parseListOptions(
    query,
    USER_SORT_FIELDS,
    "created_at",
  );

  const where = buildSearchCondition(search, ["name", "email", "address", "role"]);

  const { rows, count } = await User.findAndCountAll({
    where,
    attributes: { exclude: ["password_hash"] },
    order: [[sortBy, sortOrder]],
    limit,
    offset,
  });

  return {
    users: rows,
    pagination: buildPaginationMeta(page, limit, count),
  };
};

const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password_hash"] },
    include: [
      {
        model: Store,
        as: "ownedStore",
        attributes: ["id", "name", "email", "address", "created_at"],
      },
    ],
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const totalRatings = await Rating.count({ where: { user_id: userId } });

  return {
    ...user.get({ plain: true }),
    totalRatings,
  };
};


const updateUser = async (userId, payload) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updateData = {};

  if (payload.name !== undefined) {
    if (!payload.name.trim()) {
      throw new AppError("Name is required", 400);
    }
    updateData.name = payload.name.trim();
  }

  if (payload.email !== undefined) {
    if (!payload.email.trim()) {
      throw new AppError("Email is required", 400);
    }

    const email = payload.email.trim().toLowerCase();

    const existingUser = await User.findOne({
      where: {
        email,
        id: {
          [Op.ne]: userId,
        },
      },
    });

    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    updateData.email = email;
  }

  if (payload.address !== undefined) {
    if (!payload.address.trim()) {
      throw new AppError("Address is required", 400);
    }

    updateData.address = payload.address.trim();
  }

  if (payload.role !== undefined) {
    if (!VALID_ROLES.includes(payload.role)) {
      throw new AppError("Invalid role", 400);
    }

    updateData.role = payload.role;
  }

  if (payload.password) {
    if (payload.password.length < 8) {
      throw new AppError(
        "Password must be at least 8 characters long",
        400
      );
    }

    updateData.password_hash = await bcrypt.hash(
      payload.password,
      BCRYPT_SALT_ROUNDS
    );
  }

  await user.update(updateData);

  return formatUser(user);
};

const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Check if the user owns a store
  const ownedStore = await Store.findOne({
    where: {
      owner_id: userId,
    },
  });

  if (ownedStore) {
    throw new AppError(
      "Cannot delete this user because they own a store. Delete or reassign the store first.",
      409
    );
  }

  await user.destroy();

  return true;
};






const createStore = async (payload) => {
  const validatedInput = validateCreateStoreInput(payload);

  if (Number.isNaN(validatedInput.owner_id)) {
    throw new AppError("A valid store owner is required", 400);
  }

  const owner = await User.findByPk(validatedInput.owner_id, {
    attributes: ["id", "role"],
  });

  if (!owner) {
    throw new AppError("Store owner not found", 404);
  }

  if (owner.role !== "store_owner") {
    throw new AppError("Selected user must have the store_owner role", 400);
  }

  const existingStore = await Store.findOne({
    where: { owner_id: validatedInput.owner_id },
  });

  if (existingStore) {
    throw new AppError("This store owner already has a store", 409);
  }

  try {
    const store = await Store.create(validatedInput);

    return await Store.findByPk(store.id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError("This store owner already has a store", 409);
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new AppError("Store owner not found", 404);
    }

    throw error;
  }
};

const getStores = async (query) => {
  const { page, limit, offset, search, sortBy, sortOrder } = parseListOptions(
    query,
    STORE_SORT_FIELDS,
    "created_at",
  );

  const where = buildSearchCondition(search, ["name", "email", "address"]);

  const { rows, count } = await Store.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "email", "role"],
      },
    ],
    order: [[sortBy, sortOrder]],
    limit,
    offset,
    distinct: true,
  });

  return {
    stores: rows,
    pagination: buildPaginationMeta(page, limit, count),
  };
};

const getStoreById = async (storeId) => {
  const store = await Store.findByPk(storeId, {
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "email", "role", "address"],
      },
      {
        model: Rating,
        as: "ratings",
        separate: true,
        attributes: ["id", "rating", "user_id", "created_at"],
        order: [["created_at", "DESC"]],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
      },
    ],
  });

  if (!store) {
    throw new AppError("Store not found", 404);
  }

  const ratingStats = await Rating.findOne({
    where: { store_id: storeId },
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("id")), "totalRatings"],
      [sequelize.fn("AVG", sequelize.col("rating")), "averageRating"],
    ],
    raw: true,
  });

  return {
    ...store.get({ plain: true }),
    totalRatings: Number(ratingStats?.totalRatings || 0),
    averageRating: ratingStats?.averageRating
      ? Number(Number(ratingStats.averageRating).toFixed(2))
      : null,
  };
};


const updateStore = async (storeId, payload) => {
  const store = await Store.findByPk(storeId);

  if (!store) {
    throw new AppError("Store not found", 404);
  }

  const updateData = {};

  if (payload.name !== undefined) {
    if (!payload.name.trim()) {
      throw new AppError("Store name is required", 400);
    }

    updateData.name = payload.name.trim();
  }

  if (payload.email !== undefined) {
    if (!payload.email.trim()) {
      throw new AppError("Store email is required", 400);
    }

    updateData.email = payload.email.trim().toLowerCase();
  }

  if (payload.address !== undefined) {
    if (!payload.address.trim()) {
      throw new AppError("Store address is required", 400);
    }

    updateData.address = payload.address.trim();
  }

  if (payload.owner_id !== undefined) {
    const owner = await User.findByPk(payload.owner_id);

    if (!owner) {
      throw new AppError("Store owner not found", 404);
    }

    if (owner.role !== "store_owner") {
      throw new AppError(
        "Selected user must have the store_owner role",
        400
      );
    }

    updateData.owner_id = payload.owner_id;
  }

  await store.update(updateData);

  return await Store.findByPk(store.id, {
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "email", "role"],
      },
    ],
  });
};


const deleteStore = async (storeId) => {
  const store = await Store.findByPk(storeId);

  if (!store) {
    throw new AppError("Store not found", 404);
  }

  await store.destroy();

  return true;
};

module.exports = {
  getDashboardStats,

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