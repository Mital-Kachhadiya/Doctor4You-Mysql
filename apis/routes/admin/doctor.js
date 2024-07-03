const express = require("express");
const router = express.Router();
const { singleFileUpload } = require("../../helper/imageUpload");
const {
  addDoctor,
  updateDoctor,
  getAllDoctors,
  updateDoctorStatus,
  deleteDoctor,
  deleteMultDoctor,
  getSingleDoctor,
  updateTopDoctorStatus,
  getDoctorByid,
} = require("../../controllers/Admin/doctorController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.post(
  "/addDoctor",
  authenticAdmin,
  singleFileUpload("public/images/user", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addDoctor
);
router.put(
  "/updateDoctor/:id",
  authenticAdmin,
  singleFileUpload("public/images/user", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updateDoctor
);
router.get("/getAllDoctors", authenticAdmin, getAllDoctors);
router.get("/getSingleDoctor", authenticAdmin, getSingleDoctor);
router.get("/getDoctorByid/:id", authenticAdmin, getDoctorByid);
router.put("/updateDoctorStatus/:id", authenticAdmin, updateDoctorStatus);
router.put("/updateTopDoctorStatus/:id", authenticAdmin, updateTopDoctorStatus);
router.delete("/deleteDoctor/:id", authenticAdmin, deleteDoctor);
router.delete("/deleteMultDoctor", authenticAdmin, deleteMultDoctor);

module.exports = router;
