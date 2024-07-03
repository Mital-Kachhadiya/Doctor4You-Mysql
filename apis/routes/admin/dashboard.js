const express = require("express");
const router = express.Router();
const {
  dashboardCountData,
  getUpcomingAppointment,
  getPastAppointment,
  getTodayAppointment,
  getDatewiseAppointments,
} = require("../../controllers/Admin/dashboardController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.get("/dashboardCountData", authenticAdmin, dashboardCountData);
router.get("/getUpcomingAppointment", authenticAdmin, getUpcomingAppointment);
router.get("/getPastAppointment", authenticAdmin, getPastAppointment);
router.get("/getTodayAppointment", authenticAdmin, getTodayAppointment);
router.get("/getDatewiseAppointments", authenticAdmin, getDatewiseAppointments);

module.exports = router;
