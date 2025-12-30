const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense", "root", "1212", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

async () => {
  try {
    await sequelize.authenticate();
    console.log("connection to the database has been created");
  } catch (err) {
    console.log(err);
  }
};

module.exports = sequelize;
  