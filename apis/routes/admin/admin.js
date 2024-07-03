const express = require("express");
const router = express.Router();
const { singleFileUpload } = require("../../helper/imageUpload");

const {
  RegisterAdmin,
  LoginAdmin,
  RefreshToken,
  CheckEmailId,
  ResetPassword,
  adminDetails,
  UpdateProfile,
  ChangePassword,
} = require("../../controllers/Admin/adminController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.post("/register", RegisterAdmin);
router.post("/login", LoginAdmin);
router.post("/refreshToken", RefreshToken);
router.post("/checkmailid", CheckEmailId);
router.post("/resetPassword", ResetPassword);
router.get("/adminDetails", authenticAdmin, adminDetails);
router.post("/changePassword", authenticAdmin, ChangePassword);

router.post(
  "/UpdateProfile",
  authenticAdmin,
  singleFileUpload("public/images/user", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  UpdateProfile
);

module.exports = router;
