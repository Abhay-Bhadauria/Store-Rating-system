const User = require("./user.model");
const Store = require("./store.model");
const Rating = require("./rating.model");

User.hasOne(Store, {
  foreignKey: "owner_id",
  as: "ownedStore",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Store.belongsTo(User, {
  foreignKey: "owner_id",
  as: "owner",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

User.hasMany(Rating, {
  foreignKey: "user_id",
  as: "ratings",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Rating.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Store.hasMany(Rating, {
  foreignKey: "store_id",
  as: "ratings",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Rating.belongsTo(Store, {
  foreignKey: "store_id",
  as: "store",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

module.exports = {
  User,
  Store,
  Rating,
};
