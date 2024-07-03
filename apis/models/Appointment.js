const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnection");
const { Admin } = require("../models/Admin");
const { Patient } = require("../models/Patient");

const Appointment = sequelize.define("Appointment", {
  // user_id: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  appointment_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  order_id: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  payment_id: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  gender: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  mo_no: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  symptoms: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  symptoms_time: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  other_medicine: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  drug_allergies: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  allergie_list: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  current_location: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  // dr_id: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  shift: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  app_date: {
    type: DataTypes.DATEONLY,
    defaultValue: null,
  },
  app_time: {
    type: DataTypes.TIME,
    defaultValue: null,
  },
  treatment_type: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: 0,
  },
  admin_charges: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  admin_amount: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  doctor_amount: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  payment_amount: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 4, //4-Default Order , 0 -pending, 1 - completed, 2-cancelled
  },
  star_rating: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  review: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  recommend_status: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  refund_id: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

// Define associations
Appointment.belongsTo(Patient, { foreignKey: "user_id", as: "user" });
Appointment.belongsTo(Admin, { foreignKey: "dr_id", as: "doctor" });

module.exports = Appointment;
