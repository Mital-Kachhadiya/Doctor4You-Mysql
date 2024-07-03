const express = require("express");
const router = express.Router();
const {
  getAllFaqs,
  SendHelpMail,
  getAdminCommission,
  getAdminBankInfo,
} = require("../../controllers/App/settingsController");
const verifyToken = require("../../helper/verifyAppToken");

router.get("/getAllFaqs", getAllFaqs);
// router.get("/getAllNotification", getAllNotification);
router.post("/sendhelpmail", verifyToken, SendHelpMail);
router.get("/getAdminCommission", verifyToken, getAdminCommission);
router.get("/getAdminBankInfo", verifyToken, getAdminBankInfo);

module.exports = router;
