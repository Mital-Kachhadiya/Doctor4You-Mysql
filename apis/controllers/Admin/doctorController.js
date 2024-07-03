const express = require("express");
const { Admin, generateAuthToken, generateRefreshToken } = require("../../models/Admin");
const SpecialistCategory = require("../../models/SpecialistCategory");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");

//Add Doctor
const addDoctor = async (req, res, next) => {
  try {
    const addedData = req.body;
    addedData.password = "123456";
    addedData.role = 2;
    if (req.file) {
      addedData.image = req.file.filename;
    }
    const user = await new Admin(addedData);

    const result = await user.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Doctor
const updateDoctor = async (req, res, next) => {
  try {
    const user = await Admin.findByPk(req.params.id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "Doctor not found.");

    const updatedData = req.body;
    updatedData.image = user.image;
    if (req.file) {
      deleteFiles("user/" + user.image);
      updatedData.image = req.file.filename;
    }

    // const isUpdate = await Admin.findByIdAndUpdate(req.params.id, { $set: updatedData });
    const [updatedRowsCount, updatedAdmin] = await Admin.update(updatedData, {
      where: { id: req.params.id },
      returning: true, // This option is to return the updated record(s)
    });
    if (updatedRowsCount < 0) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const result = await Admin.findByPk(req.params.id);

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;
    const modifiedRes = {
      doctors: result,
      baseUrl: `${baseUrl}`,
    };

    return successResponse(res, modifiedRes);
  } catch (err) {
    next(err);
  }
};

//Get All Doctors
const getAllDoctors = async (req, res, next) => {
  try {
    const doc = await Admin.findAll({
      include: [
        {
          model: SpecialistCategory,
          as: "category", // Alias for the User model
          attributes: ["id", "title"], // Specify the attributes you want to include
        },
      ],
      where: { role: 2 },
    });
    if (!doc) return queryErrorRelatedResponse(req, res, 404, "Doctors not found.");

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;
    const modifiedRes = {
      doctors: doc,
      baseUrl: `${baseUrl}`,
    };

    successResponse(res, modifiedRes);
  } catch (err) {
    next(err);
  }
};

//Update Doctor Status
const updateDoctorStatus = async (req, res, next) => {
  try {
    const user = await Admin.findByPk(req.params.id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "Doctor not found.");

    user.status = !user.status;
    const result = await user.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Doctor Status
const updateTopDoctorStatus = async (req, res, next) => {
  try {
    const user = await Admin.findByPk(req.params.id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "Doctor not found.");

    user.top_dr = !user.top_dr;
    const result = await user.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Delete Single Doctor
const deleteDoctor = async (req, res, next) => {
  try {
    const user = await Admin.findByPk(req.params.id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "Doctor not found.");
    deleteFiles("user/" + user.image);
    await Admin.destroy({
      where: { id: req.params.id },
    });
    deleteResponse(res, "Doctor deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Delete Multiple Doctors
const deleteMultDoctor = async (req, res, next) => {
  try {
    const { Ids } = req.body;
    Ids.map(async (item) => {
      const user = await Admin.findByPk(item);
      if (!user) return queryErrorRelatedResponse(req, res, 404, "Doctor not found.");
      deleteFiles("user/" + user.image);

      await Admin.destroy({
        where: { id: item },
      });
    });
    deleteResponse(res, "All selected records deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Get Single Doctors
const getSingleDoctor = async (req, res, next) => {
  try {
    const doc = await Admin.findOne({
      where: { role: 2, id: req.admin.id },
    });
    if (!doc) return queryErrorRelatedResponse(req, res, 404, "Doctors not found.");

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;
    const modifiedRes = {
      doctors: doc,
      baseUrl: `${baseUrl}`,
    };

    successResponse(res, modifiedRes);
  } catch (err) {
    next(err);
  }
};

//Get Doctor By ID
const getDoctorByid = async (req, res, next) => {
  try {
    const doc = await Admin.findOne({
      include: [
        {
          model: SpecialistCategory,
          as: "category", // Alias for the User model
          attributes: ["id", "title"], // Specify the attributes you want to include
        },
      ],
      where: { role: 2, id: req.params.id },
    });
    if (!doc) return queryErrorRelatedResponse(req, res, 404, "Doctors not found.");

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;
    const modifiedRes = {
      doctors: doc,
      baseUrl: `${baseUrl}`,
    };

    successResponse(res, modifiedRes);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllDoctors,
  updateDoctorStatus,
  deleteDoctor,
  deleteMultDoctor,
  addDoctor,
  updateDoctor,
  getSingleDoctor,
  updateTopDoctorStatus,
  getDoctorByid,
};
