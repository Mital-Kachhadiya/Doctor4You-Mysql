const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql", // e.g., 'mysql', 'postgres', 'sqlite', 'mssql'
  host: "localhost",
  username: "mital",
  password: "123456",
  database: "doctor4you",
});

module.exports = sequelize;
