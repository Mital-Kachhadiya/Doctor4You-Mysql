const express = require("express");
const router = express.Router();
const { singleFileUpload } = require("../../helper/imageUpload");

const {
  addSpecialistCategory,
  updateSpecialistCategory,
  updateSpeCatStatus,
  deleteSpecialistCategory,
  deleteMultSpecialistCategory,
  getAllSpecialistCategory,
} = require("../../controllers/Admin/specialistCategoryController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.post(
  "/addSpecialistCategory",
  authenticAdmin,
  singleFileUpload("public/images/SpecialistCategory", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "icon"),
  addSpecialistCategory
);
router.put(
  "/updateSpecialistCategory/:id",
  authenticAdmin,
  singleFileUpload("public/images/SpecialistCategory", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "icon"),
  updateSpecialistCategory
);
router.put("/updateSpeCatStatus/:id", authenticAdmin, updateSpeCatStatus);
router.delete("/deleteSpecialistCategory/:id", authenticAdmin, deleteSpecialistCategory);
router.delete("/deleteMultSpecialistCategory", authenticAdmin, deleteMultSpecialistCategory);
router.get("/getAllSpecialistCategory", authenticAdmin, getAllSpecialistCategory);

module.exports = router;
