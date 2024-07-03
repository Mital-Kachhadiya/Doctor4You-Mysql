const express = require("express");
const { Admin, generateAuthToken, generateRefreshToken } = require("../../models/Admin");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const { generateTimeSlots } = require("../../helper/generateTimeSlots");
const deleteFiles = require("../../helper/deleteFiles");
const Favorite = require("../../models/Favorite");
const { Op } = require("sequelize");
const Appointment = require("../../models/Appointment");
const sequelize = require("sequelize");
const moment = require("moment-timezone");

//Get All Top Doctors
const getAllTopDoctors = async (req, res, next) => {
  try {
    const doc = await Admin.findAll({
      where: { role: 2, top_dr: true, status: true },
    });
    if (!doc) return queryErrorRelatedResponse(req, res, 404, "Doctors not found.");

    const modifiedData = await Promise.all(
      doc.map(async (item) => {
        const reviews = await Appointment.findAll({
          where: { dr_id: item.id, status: 1, review: { [sequelize.Op.not]: null } },
          attributes: [[sequelize.fn("AVG", sequelize.col("star_rating")), "rating"], "review"],
          group: ["review"],
        });
        const avgRating = reviews.length > 0 ? reviews[0].dataValues.rating : 0;
        return {
          ...item.toJSON(),
          reviews: reviews,
          avgRating: avgRating,
          reviewsCount: reviews.length,
        };
      })
    );

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;
    const modifiedRes = {
      doctors: modifiedData,
      baseUrl: `${baseUrl}`,
    };

    successResponse(res, modifiedRes);
  } catch (err) {
    next(err);
  }
};

//Get All Doctors
const getAllDoctors = async (req, res, next) => {
  try {
    const doc = await Admin.findAll({
      where: { role: 2, status: true },
    });
    if (!doc) return queryErrorRelatedResponse(req, res, 404, "Doctors not found.");

    const modifiedData = await Promise.all(
      doc.map(async (item) => {
        const reviews = await Appointment.findAll({
          where: { dr_id: item.id, status: 1, review: { [sequelize.Op.not]: null } },
          attributes: [[sequelize.fn("AVG", sequelize.col("star_rating")), "rating"], "review"],
          group: ["review"],
        });
        const avgRating = reviews.length > 0 ? reviews[0].dataValues.rating : 0;
        return {
          ...item.toJSON(),
          reviews: reviews,
          avgRating: avgRating,
          reviewsCount: reviews.length,
        };
      })
    );

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;
    const modifiedRes = {
      doctors: modifiedData,
      baseUrl: `${baseUrl}`,
    };

    successResponse(res, modifiedRes);
  } catch (err) {
    next(err);
  }
};

//Get All Favorite Doctor
const getAllFavDr = async (req, res, next) => {
  try {
    const favDr = await Favorite.findAll({
      include: [
        {
          model: Admin,
          as: "doctor", // Alias for the Doctor model
        },
      ],
      attributes: ["id"],
      where: { user_id: req.patient.id },
    });
    if (!favDr) return queryErrorRelatedResponse(req, res, 404, "Favorite Doctor not found.");

    const modifiedData = await Promise.all(
      favDr.map(async (item) => {
        const reviews = await Appointment.findAll({
          where: { dr_id: item.doctor.id, status: 1, review: { [sequelize.Op.not]: null } },
          attributes: [[sequelize.fn("AVG", sequelize.col("star_rating")), "rating"], "review"],
          group: ["review"],
        });
        const avgRating = reviews.length > 0 ? reviews[0].dataValues.rating : 0;
        return {
          ...item.toJSON(),
          reviews: reviews,
          avgRating: avgRating,
          reviewsCount: reviews.length,
        };
      })
    );

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;
    const modifiedCat = {
      doctors: modifiedData,
      baseUrl: `${baseUrl}`,
    };

    successResponse(res, modifiedCat);
  } catch (err) {
    next(err);
  }
};

//Search Doctor
const searchDr = async (req, res, next) => {
  try {
    const searchQuery = req.body.searchQuery;
    const doc = await Admin.findAll({
      where: {
        role: 2,
        status: true,
        name: {
          [Op.like]: `%${searchQuery}%`,
        },
      },
    });
    if (!doc) return queryErrorRelatedResponse(req, res, 404, "Doctors not found.");

    const modifiedData = await Promise.all(
      doc.map(async (item) => {
        const reviews = await Appointment.findAll({
          where: { dr_id: item.id, status: 1, review: { [sequelize.Op.not]: null } },
          attributes: [[sequelize.fn("AVG", sequelize.col("star_rating")), "rating"], "review"],
          group: ["review"],
        });
        const avgRating = reviews.length > 0 ? reviews[0].dataValues.rating : 0;
        return {
          ...item.toJSON(),
          reviews: reviews,
          avgRating: avgRating,
          reviewsCount: reviews.length,
        };
      })
    );

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;
    const modifiedRes = {
      doctors: modifiedData,
      baseUrl: `${baseUrl}`,
    };

    successResponse(res, modifiedRes);
  } catch (err) {
    next(err);
  }
};

const DoctorById = async (req, res, next) => {
  try {
    const doc = await Admin.findByPk(req.body.id); // Assuming you want to find by primary key (ID)
    if (!doc) return queryErrorRelatedResponse(req, res, 404, "Doctor not found.");

    let morningTimeSlots = null;
    let eveningTimeSlots = null;

    if (doc.morning_shift) {
      morningTimeSlots = generateTimeSlots(
        doc.morning_start_time,
        doc.morning_end_time,
        parseInt(doc.morning_duration)
      );
    }

    if (doc.evening_shift) {
      eveningTimeSlots = generateTimeSlots(
        doc.evening_start_time,
        doc.evening_end_time,
        parseInt(doc.evening_duration)
      );
    }

    const reviews = await Appointment.findAll({
      where: { dr_id: doc.id, status: 1, review: { [sequelize.Op.not]: null } },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("star_rating")), "rating"],
        [sequelize.fn("COUNT", sequelize.col("review")), "reviewsCount"],
      ],
      group: ["review"],
    });

    const avgRating = reviews.length > 0 ? reviews[0].dataValues.rating : 0;

    const today = new Date();
    const booked_app = await Appointment.findAll({
      where: {
        dr_id: doc.id,
        app_date: {
          [Op.gte]: today, // Op.gte means greater than or equal to today
        },
      },
      attributes: ["app_date", "app_time", "shift"],
    });

    const favorite = await Favorite.findOne({ where: { user_id: req.patient.id, dr_id: req.body.id } });
    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;
    const modifiedRes = {
      doctor: {
        ...doc.toJSON(),
        morning_start_time: moment(doc.morning_start_time).format("hh:mm A"),
        morning_end_time: moment(doc.morning_end_time).format("hh:mm A"),
        evening_start_time: moment(doc.evening_start_time).format("hh:mm A"),
        evening_end_time: moment(doc.evening_end_time).format("hh:mm A"),
        morningTimeSlots: morningTimeSlots,
        eveningTimeSlots: eveningTimeSlots,
        reviews: reviews,
        avgRating: avgRating,
        booked_appointments: booked_app,
        like: favorite ? 1 : 0,
        baseUrl: `${baseUrl}`,
      },
    };

    successResponse(res, modifiedRes);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTopDoctors,
  getAllDoctors,
  getAllFavDr,
  searchDr,
  DoctorById,
};
