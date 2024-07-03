const express = require("express");
const SpecialistCategory = require("../../models/SpecialistCategory");
const deleteFiles = require("../../helper/deleteFiles");

const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");

//Add Specialist Category
const addSpecialistCategory = async (req, res, next) => {
  try {
    const addedEss = req.body;
    if (req.file) {
      addedEss.icon = req.file.filename;
    }
    const newCat = await new SpecialistCategory(addedEss);

    const result = await newCat.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Specialist Category
const updateSpecialistCategory = async (req, res, next) => {
  try {
    const cat = await SpecialistCategory.findByPk(req.params.id);
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Specialist Category not found.");

    const updatedData = req.body;
    updatedData.icon = cat.icon;
    if (req.file) {
      deleteFiles("SpecialistCategory/" + cat.icon);
      updatedData.icon = req.file.filename;
    }

    const [updatedRowsCount, updatedCat] = await SpecialistCategory.update(updatedData, {
      where: { id: req.params.id },
      returning: true, // This option is to return the updated record(s)
    });
    if (updatedRowsCount < 0) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const result = await SpecialistCategory.findByPk(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Specialist Category Status
const updateSpeCatStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cat = await SpecialistCategory.findByPk(id);
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Specialist Category not found.");

    cat.status = !cat.status;
    const result = await cat.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Delete Single Specialist Category
const deleteSpecialistCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cat = await SpecialistCategory.findByPk(id);
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Specialist Category not found.");
    deleteFiles("SpecialistCategory/" + cat.icon);
    await SpecialistCategory.destroy({
      where: { id: id },
    });
    deleteResponse(res, "Specialist Category deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Delete Multiple SpecialistCategory
const deleteMultSpecialistCategory = async (req, res, next) => {
  try {
    const { Ids } = req.body;
    Ids.map(async (item) => {
      const cat = await SpecialistCategory.findByPk(item);
      if (!cat) return queryErrorRelatedResponse(req, res, 404, "Specialist Category not found.");
      deleteFiles("SpecialistCategory/" + cat.icon);

      await SpecialistCategory.destroy({
        where: { id: item },
      });
    });
    deleteResponse(res, "All selected records deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Get All SpecialistCategory
const getAllSpecialistCategory = async (req, res, next) => {
  try {
    const cat = await SpecialistCategory.findAll();
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Specialist Category not found.");

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_SPECIALIST_CATEGORY_PATH;
    const modifiedCat = {
      cat: cat,
      baseUrl: `${baseUrl}`,
    };

    successResponse(res, modifiedCat);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addSpecialistCategory,
  updateSpecialistCategory,
  updateSpeCatStatus,
  deleteSpecialistCategory,
  deleteMultSpecialistCategory,
  getAllSpecialistCategory,
};
