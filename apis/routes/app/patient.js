const express = require("express");
const router = express.Router();
const { singleFileUpload } = require("../../helper/imageUpload");

const {
  RegisterPatient,
  updatePatientProfile,
  signinPatient,
  socialLogin,
  checkMoNo,
  checkPatientOtp,
  resetPassword,
  likeDr,
  RefreshToken,
  PatientById,
} = require("../../controllers/App/patientController");
const verifyToken = require("../../helper/verifyAppToken");

router.post("/signup", RegisterPatient);
router.post(
  "/updateProfile",
  verifyToken,
  singleFileUpload("public/images/patient", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updatePatientProfile
);
router.post("/signinPatient", signinPatient);
router.post("/socialLogin", socialLogin);
router.post("/checkMoNo", checkMoNo);
router.post("/checkOtp", checkPatientOtp);
router.post("/resetPassword", resetPassword);
router.post("/likeDr", verifyToken, likeDr);
router.post("/refreshToken", RefreshToken);
router.post("/PatientById", verifyToken, PatientById);
module.exports = router;
