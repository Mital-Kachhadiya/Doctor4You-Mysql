const express = require("express");
const router = express.Router();

const verifyToken = require("../../helper/verifyAppToken");
const { getAllSpecialistCategory } = require("../../controllers/App/specialistCategoryController");

router.get("/getAllSpecialistCategory", verifyToken, getAllSpecialistCategory);

module.exports = router;
