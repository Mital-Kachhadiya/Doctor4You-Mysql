const router = require("express").Router();
const adminRouter = require("../admin/admin");
const specialistCategoryRouter = require("../admin/specialistCategory");
const doctorRouter = require("../admin/doctor");
const settingsRouter = require("../admin/settings");
const patientRouter = require("../admin/patient");
const appointmentRouter = require("../admin/appointment");
const dashboardRouter = require("../admin/dashboard");
const walletRouter = require("../admin/walletTransaction");

// Use router in index
router.use("/admin", adminRouter);
router.use("/admin/specialistCategory", specialistCategoryRouter);
router.use("/admin/doctor", doctorRouter);
router.use("/admin/settings", settingsRouter);
router.use("/admin/patient", patientRouter);
router.use("/admin/appointment", appointmentRouter);
router.use("/admin/dashboard", dashboardRouter);
router.use("/admin/walletTransaction", walletRouter);

module.exports = router;
