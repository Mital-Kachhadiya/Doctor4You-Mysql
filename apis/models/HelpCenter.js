const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnection");
const { Patient } = require("../models/Patient");

const Helpcenter = sequelize.define("Helpcenter", {
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

Helpcenter.belongsTo(Patient, { foreignKey: "user_id", as: "user" });

module.exports = Helpcenter;
