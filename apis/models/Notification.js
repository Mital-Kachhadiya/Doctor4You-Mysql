const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnection");
const { Patient } = require("../models/Patient");

const Notification = sequelize.define("Notification", {
  title: {
    type: DataTypes.TEXT,
    defaultValue: true,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: true,
  },
});

Notification.belongsTo(Patient, { foreignKey: "user_id", as: "user" });

module.exports = Notification;
