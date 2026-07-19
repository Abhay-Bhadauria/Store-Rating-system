require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/db");

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync();
      console.log("Database synchronized successfully.");
    }

    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  } catch (error) {
    console.error("Unable to initialize the server:", error);
    process.exit(1);
  }
};

startServer();
