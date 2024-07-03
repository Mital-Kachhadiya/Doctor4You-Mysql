const express = require("express");
const router = express.Router();
const {
  addfaqs,
  getAllFaqs,
  updateFaq,
  updateFaqStatus,
  deleteMultFaq,
  deletefaq,
  updateGeneralSetting,
  getGeneralSettings,
  addGeneralSettings,
  customerIssue,
  updateCustomerIssueStatus,
} = require("../../controllers/Admin/settingsController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.post("/addfaqs", authenticAdmin, addfaqs);
router.get("/getAllFaqs", authenticAdmin, getAllFaqs);
router.put("/updateFaq/:id", authenticAdmin, updateFaq);
router.delete("/deletefaq/:id", authenticAdmin, deletefaq);
router.delete("/deleteMultFaq", authenticAdmin, deleteMultFaq);
router.put("/updateFaqStatus/:id", authenticAdmin, updateFaqStatus);
router.put("/updateGeneralSetting/:id", authenticAdmin, updateGeneralSetting);
router.get("/getGeneralSettings", authenticAdmin, getGeneralSettings);
router.post("/addGeneralSettings", authenticAdmin, addGeneralSettings);
router.get("/customerIssue", authenticAdmin, customerIssue);
router.put("/updateCustomerIssueStatus/:id", authenticAdmin, updateCustomerIssueStatus);

module.exports = router;
