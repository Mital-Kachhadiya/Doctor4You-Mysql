const express = require("express");
const router = express.Router();
const { singleFileUpload } = require("../../helper/imageUpload");
const {
  addPatient,
  getAllPatient,
  updatePatient,
  updatePatientStatus,
  deletePatient,
  deleteMultPatient,
  getPatientByid,
} = require("../../controllers/Admin/patientController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.post(
  "/addPatient",
  authenticAdmin,
  singleFileUpload("public/images/patient", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addPatient
);
router.put(
  "/updatePatient/:id",
  authenticAdmin,
  singleFileUpload("public/images/patient", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updatePatient
);
router.get("/getAllPatient", authenticAdmin, getAllPatient);
router.get("/getPatientByid/:id", authenticAdmin, getPatientByid);
router.put("/updatePatientStatus/:id", authenticAdmin, updatePatientStatus);
router.delete("/deletePatient/:id", authenticAdmin, deletePatient);
router.delete("/deleteMultPatient", authenticAdmin, deleteMultPatient);

module.exports = router;
