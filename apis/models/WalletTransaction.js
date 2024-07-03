const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnection");
const { Admin } = require("../models/Admin");
const Appointment = require("../models/Appointment");

const WalletTransaction = sequelize.define("WalletTransaction", {
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: true,
  },
});

WalletTransaction.belongsTo(Admin, { foreignKey: "dr_id", as: "doctor" });
WalletTransaction.belongsTo(Appointment, { foreignKey: "appointment_id", as: "appointment" });

module.exports = WalletTransaction;
