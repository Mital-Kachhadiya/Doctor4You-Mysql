const express = require("express");
const router = express.Router();
const {
  getAllTopDoctors,
  getAllDoctors,
  getAllFavDr,
  searchDr,
  DoctorById,
} = require("../../controllers/App/doctorController");
const verifyToken = require("../../helper/verifyAppToken");

router.get("/getAllDoctors", verifyToken, getAllDoctors);
router.get("/getAllTopDoctors", verifyToken, getAllTopDoctors);
router.get("/getAllFavDr", verifyToken, getAllFavDr);
router.post("/searchDr", verifyToken, searchDr);
router.post("/DoctorById", verifyToken, DoctorById);

module.exports = router;
