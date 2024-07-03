const Notification = require("../../models/Notification");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");

//Get Active Notifications
const getAllNotifications = async (req, res, next) => {
  try {
    const noti = await Notification.findAll({ where: { user_id: req.patient.id } });
    if (!noti) return queryErrorRelatedResponse(req, res, 404, "Notifications not found.");

    successResponse(res, noti);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllNotifications,
};
