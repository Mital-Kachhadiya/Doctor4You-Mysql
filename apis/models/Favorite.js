const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnection");
const { Admin } = require("../models/Admin");
const { Patient } = require("../models/Patient");

const Favorite = sequelize.define("Favorite", {});
// Define associations
Favorite.belongsTo(Patient, { foreignKey: "user_id", as: "user" });
Favorite.belongsTo(Admin, { foreignKey: "dr_id", as: "doctor" });

module.exports = Favorite;
