const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SpecialistCategory = require("../models/SpecialistCategory");

const Admin = sequelize.define(
  "Admin",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    mo_no: {
      type: DataTypes.STRING,
    },
    wapp_no: {
      type: DataTypes.STRING,
    },
    experience: {
      type: DataTypes.STRING,
    },
    about: {
      type: DataTypes.TEXT,
    },
    work_place_name: {
      type: DataTypes.STRING,
    },
    work_place_address: {
      type: DataTypes.STRING,
    },
    patients_count: {
      type: DataTypes.STRING,
    },
    working_days: {
      type: DataTypes.TEXT,
    },
    morning_shift: {
      type: DataTypes.BOOLEAN,
    },
    morning_start_time: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    morning_end_time: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    morning_duration: { type: DataTypes.STRING },
    evening_shift: {
      type: DataTypes.BOOLEAN,
    },
    evening_start_time: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    evening_end_time: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    evening_duration: { type: DataTypes.STRING },
    call_msg_price: {
      type: DataTypes.STRING,
    },
    house_visit_price: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 1,
    },
    top_dr: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    otp: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    expireOtpTime: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    remember_token: {
      type: DataTypes.STRING(512),
    },
    refresh_token: {
      type: DataTypes.STRING(512),
    },
    resetCode: {
      type: DataTypes.STRING,
    },
    bank_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    acc_holder_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    acc_number: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    ifsc_code: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    wallet_amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.changed("password")) {
          admin.password = await bcrypt.hash(admin.password, 12);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed("password")) {
          admin.password = await bcrypt.hash(admin.password, 12);
        }
      },
    },
  }
);

// Admin.associate = (models) => {
//   Admin.belongsTo(models.SpecialistCategory, {
//     foreignKey: "specialist_cat",
//     as: "category",
//   });
// };

Admin.belongsTo(SpecialistCategory, { foreignKey: "specialist_cat", as: "category" });

const generateAuthToken = function (admin, data) {
  const id = { _id: admin.id };
  data = { ...data, ...id, password: admin.password };
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

const generateRefreshToken = function (admin, data) {
  const id = { _id: admin.id };
  data = { ...data, ...id, password: admin.password };
  const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
  return token;
};

module.exports = { Admin, generateAuthToken, generateRefreshToken };
