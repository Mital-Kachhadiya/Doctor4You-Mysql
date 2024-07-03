const express = require("express");
const router = express.Router();
const { getAllNotifications } = require("../../controllers/App/notificationController");
const verifyToken = require("../../helper/verifyAppToken");

router.get("/getAllNotifications", verifyToken, getAllNotifications);

module.exports = router;
