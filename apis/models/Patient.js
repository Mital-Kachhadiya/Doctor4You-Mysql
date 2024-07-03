const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Patient = sequelize.define(
  "Patient",
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
    mo_no: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    dob: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 1,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    addbydr: {
      type: DataTypes.STRING,
      defaultValue: 0,
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
    fcm_token: {
      type: DataTypes.STRING,
      defaultValue: null,
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

module.exports = { Patient, generateAuthToken, generateRefreshToken };
