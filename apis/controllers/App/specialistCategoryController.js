const express = require("express");
const SpecialistCategory = require("../../models/SpecialistCategory");
const deleteFiles = require("../../helper/deleteFiles");
const { Admin, generateAuthToken, generateRefreshToken } = require("../../models/Admin");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const Appointment = require("../../models/Appointment");
const sequelize = require("sequelize");
//Get All SpecialistCategory
const getAllSpecialistCategory = async (req, res, next) => {
  try {
    const cat = await SpecialistCategory.findAll({ where: { status: 1 } });
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Specialist Category not found.");

    // Add doctors parameter to each item in the cat array
    const modifiedData = await Promise.all(
      cat.map(async (item) => {
        const doctors = await Admin.findAll({ where: { specialist_cat: item.id } });

        const modifiedDoc = await Promise.all(
          doctors.map(async (item) => {
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

        return {
          ...item.toJSON(),
          doctorsCount: doctors.length,
          doctors: modifiedDoc || [],
        };
      })
    );

    console.log(modifiedData);
    //specialist_cat
    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_SPECIALIST_CATEGORY_PATH;

    const baseUrl_dr =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;

    const modifiedCat = {
      cat: modifiedData,
      baseUrl: `${baseUrl}`,
      baseUrl_dr: baseUrl_dr,
    };

    successResponse(res, modifiedCat);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllSpecialistCategory,
};
