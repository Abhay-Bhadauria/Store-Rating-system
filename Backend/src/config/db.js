const { Sequelize } = require("sequelize");

const isDevelopment = process.env.NODE_ENV === "development";
const useSsl = process.env.DB_SSL === "true";

const sequelizeOptions = {
  dialect: "postgres",
  logging: isDevelopment ? console.log : false,
};

if (useSsl) {
  sequelizeOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
    },
  };
}

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, sequelizeOptions)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        ...sequelizeOptions,
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
      },
    );

module.exports = sequelize;
