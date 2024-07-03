const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnection");

const GeneralSettings = sequelize.define("GeneralSetings", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  admin_charges: {
    type: DataTypes.INTEGER,
    default: 0,
  },
  razorpay_key_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  razorpay_key_secret: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = GeneralSettings;
