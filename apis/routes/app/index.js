const router = require("express").Router();
const patientRouter = require("../app/patient");
const appointmentRouter = require("../app/appointment");
const specialistCategoryRouter = require("../app/specialistCategory");
const doctorRouter = require("../app/doctor");
const settingsRouter = require("../app/settings");
const notificationRouter = require("../app/notification");

// Use router in index
router.use("/app/patient", patientRouter);
router.use("/app/appointment", appointmentRouter);
router.use("/app/specialistCategory", specialistCategoryRouter);
router.use("/app/doctor", doctorRouter);
router.use("/app/setting", settingsRouter);
router.use("/app/notification", notificationRouter);

module.exports = router;
