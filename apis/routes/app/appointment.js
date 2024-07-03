const express = require("express");
const router = express.Router();
const {
  addAppointment,
  addAppReview,
  getUpcomingAppointment,
  getPastAppointment,
  createPaymentUrl,
  callback,
} = require("../../controllers/App/appointmentController");
const verifyToken = require("../../helper/verifyAppToken");

router.post("/addAppointment", verifyToken, addAppointment);
router.post("/addAppReview", verifyToken, addAppReview);
router.get("/getUpcomingAppointment", verifyToken, getUpcomingAppointment);
router.get("/getPastAppointment", verifyToken, getPastAppointment);
router.post("/createPaymentUrl", verifyToken, createPaymentUrl);
router.get("/callback", callback);

module.exports = router;
