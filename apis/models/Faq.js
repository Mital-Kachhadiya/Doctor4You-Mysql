const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnection");

const Faq = sequelize.define("Faq", {
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Faq;
