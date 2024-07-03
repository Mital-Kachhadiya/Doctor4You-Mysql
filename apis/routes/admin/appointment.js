const express = require("express");
const router = express.Router();
const {
  getAllAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getPendingAppointment,
  getCompletedAppointment,
  getCancelledAppointment,
} = require("../../controllers/Admin/appointmentController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.get("/getAllAppointment", authenticAdmin, getAllAppointment);
router.put("/updateAppointmentStatus/:id", authenticAdmin, updateAppointmentStatus);
router.delete("/deleteAppointment/:id", authenticAdmin, deleteAppointment);
router.get("/getPendingAppointment", authenticAdmin, getPendingAppointment);
router.get("/getCompletedAppointment", authenticAdmin, getCompletedAppointment);
router.get("/getCancelledAppointment", authenticAdmin, getCancelledAppointment);

module.exports = router;
