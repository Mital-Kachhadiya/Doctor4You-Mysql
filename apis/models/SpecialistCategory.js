const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnection");

const SpecialistCategory = sequelize.define("SpecialistCategory", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = SpecialistCategory;
