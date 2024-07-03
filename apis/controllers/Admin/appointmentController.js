const express = require("express");
const Appointment = require("../../models/Appointment");
const GeneralSettings = require("../../models/GeneralSettings");
const Notification = require("../../models/Notification");
const WalletTransaction = require("../../models/WalletTransaction");
const { Admin } = require("../../models/Admin");
const { Patient } = require("../../models/Patient");
const { generateUniqueID } = require("../../helper/uniqueId");

const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const { Op } = require("sequelize");
const createRazorpayInstance = require("../../helper/razorpay");
const admin = require("firebase-admin");
const serviceAccount = require("../../config/doctor4you-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//Get All Appointment
const getAllAppointment = async (req, res, next) => {
  try {
    let whereCondition = {
      status: { [Op.ne]: 4 }, // Default condition: status is not equal to 4
    };

    if (req.admin.role === "2") {
      // If the role is 2, include the where condition with dr_id
      whereCondition = {
        dr_id: req.admin.id,
      };
    }

    const appointments = await Appointment.findAll({
      include: [
        {
          model: Patient,
          as: "user", // Alias for the User model
          attributes: ["id", "name", "email", "mo_no", "image"], // Specify the attributes you want to include
        },
        {
          model: Admin,
          as: "doctor", // Alias for the Doctor model
          attributes: ["id", "name", "email", "mo_no", "image"], // Specify the attributes you want to include
        },
      ],
      where: whereCondition, // Apply the where condition based on the role
    });

    if (!appointments || appointments.length === 0) {
      return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");
    }
    const doc_baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;
    const user_baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PATIENT_PATH;
    // Combine the appointment data with user and doctor data
    const enhancedAppointments = appointments.map((appointment) => ({
      ...appointment.dataValues,
      user: appointment.user || {},
      doctor: appointment.doctor || {},
      doc_baseUrl: doc_baseUrl,
      user_baseUrl: user_baseUrl,
    }));

    successResponse(res, enhancedAppointments);
  } catch (err) {
    next(err);
  }
};

//Get All Pending Appointment
const getPendingAppointment = async (req, res, next) => {
  try {
    let whereCondition = {};
    if (req.admin.role === "2") {
      // If the role is 2, include the where condition with dr_id
      whereCondition = {
        dr_id: req.admin.id,
      };
    }
    whereCondition.status = 0;
    const appointments = await Appointment.findAll({
      include: [
        {
          model: Patient,
          as: "user", // Alias for the User model
          attributes: ["id", "name"], // Specify the attributes you want to include
        },
        {
          model: Admin,
          as: "doctor", // Alias for the Doctor model
          attributes: ["id", "name"], // Specify the attributes you want to include
        },
      ],
      where: whereCondition, // Apply the where condition based on the role
    });

    if (!appointments || appointments.length === 0) {
      return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");
    }

    // Combine the appointment data with user and doctor data
    const enhancedAppointments = appointments.map((appointment) => ({
      ...appointment.dataValues,
      user: appointment.user || {},
      doctor: appointment.doctor || {},
    }));

    successResponse(res, enhancedAppointments);
  } catch (err) {
    next(err);
  }
};

//Get All Completed Appointment
const getCompletedAppointment = async (req, res, next) => {
  try {
    let whereCondition = {};
    if (req.admin.role === "2") {
      // If the role is 2, include the where condition with dr_id
      whereCondition = {
        dr_id: req.admin.id,
      };
    }
    whereCondition.status = 1;
    const appointments = await Appointment.findAll({
      include: [
        {
          model: Patient,
          as: "user", // Alias for the User model
          attributes: ["id", "name"], // Specify the attributes you want to include
        },
        {
          model: Admin,
          as: "doctor", // Alias for the Doctor model
          attributes: ["id", "name"], // Specify the attributes you want to include
        },
      ],
      where: whereCondition, // Apply the where condition based on the role
    });

    if (!appointments || appointments.length === 0) {
      return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");
    }

    // Combine the appointment data with user and doctor data
    const enhancedAppointments = appointments.map((appointment) => ({
      ...appointment.dataValues,
      user: appointment.user || {},
      doctor: appointment.doctor || {},
    }));

    successResponse(res, enhancedAppointments);
  } catch (err) {
    next(err);
  }
};

//Get All Cancelled Appointment
const getCancelledAppointment = async (req, res, next) => {
  try {
    let whereCondition = {};
    if (req.admin.role === "2") {
      // If the role is 2, include the where condition with dr_id
      whereCondition = {
        dr_id: req.admin.id,
      };
    }
    whereCondition.status = 2;
    const appointments = await Appointment.findAll({
      include: [
        {
          model: Patient,
          as: "user", // Alias for the User model
          attributes: ["id", "name"], // Specify the attributes you want to include
        },
        {
          model: Admin,
          as: "doctor", // Alias for the Doctor model
          attributes: ["id", "name"], // Specify the attributes you want to include
        },
      ],
      where: whereCondition, // Apply the where condition based on the role
    });

    if (!appointments || appointments.length === 0) {
      return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");
    }

    // Combine the appointment data with user and doctor data
    const enhancedAppointments = appointments.map((appointment) => ({
      ...appointment.dataValues,
      user: appointment.user || {},
      doctor: appointment.doctor || {},
    }));

    successResponse(res, enhancedAppointments);
  } catch (err) {
    next(err);
  }
};

//Update Appointment Status
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");

    const appointmentCom = await Appointment.findOne({
      where: { id: req.params.id, status: 1 },
    });
    if (appointmentCom)
      return queryErrorRelatedResponse(
        req,
        res,
        404,
        "You are not able to change the appointment status which is already completed"
      );

    const appointmentCan = await Appointment.findOne({
      where: { id: req.params.id, status: 2 },
    });
    if (appointmentCan)
      return queryErrorRelatedResponse(
        req,
        res,
        404,
        "You are not able to change the appointment status which is already cancelled"
      );

    let result = {};
    let title = "";
    let description = "";
    const user = await Patient.findByPk(appointment.user_id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "Patient not found.");

    if (req.body.status == "1") {
      title = "Congratulations! Appointment Completed!";
      description =
        "Congratulations! Your appointment has been completed. Here's your appointment ID: " +
        appointment.appointment_id +
        ". We hope you had a positive experience and look forward to serving you again in the future.";
    } else if (req.body.status == "2") {
      title = "Sorry, Appointment Cancellation Notice";
      description =
        "Unfortunately, your appointment with ID " +
        appointment.appointment_id +
        " has been canceled. Your refund will be processed, and you can expect to receive it within 5 to 7 working days, credited directly to your bank account.";
    }
    if (req.body.status == "2") {
      const razorpayData = await GeneralSettings.findOne();
      const razorpay = createRazorpayInstance(razorpayData.razorpay_key_id, razorpayData.razorpay_key_secret);
      const refundData = await razorpay.payments.refund(appointment.payment_id, {
        speed: "optimum",
        notes: {
          refund_reason: `Refund for canceled appointment with ID ${appointment.appointment_id}`,
        },
      });
      if (refundData && refundData.id) {
        appointment.status = req.body.status;
        appointment.refund_id = refundData.id;
        result = await appointment.save();
        const newNoti = await Notification.create({
          title: title,
          description: description,
          user_id: appointment.user_id,
        });
        await newNoti.save();
        if (user.fcm_token != "") {
          const message = {
            notification: {
              title: title,
              body: description,
            },
            token: user.fcm_token,
          };
          await admin.messaging().send(message);
        }
        return successResponse(res, result);
      } else {
        return res.status(400).send("Something went wrong...");
      }
    } else if (req.body.status == "1") {
      appointment.status = req.body.status;
      result = await appointment.save();

      const doctor = await Admin.findByPk(appointment.dr_id);
      if (!doctor) return queryErrorRelatedResponse(req, res, 404, "Doctor not found.");

      const transaction_id = generateUniqueID();
      const walletAdd = await WalletTransaction.create({
        transaction_id: transaction_id,
        dr_id: appointment.dr_id,
        appointment_id: appointment.id,
        amount: parseFloat(appointment.doctor_amount),
      });
      await walletAdd.save();

      const walletAmt = parseFloat(doctor.wallet_amount) + parseFloat(appointment.doctor_amount);
      doctor.wallet_amount = walletAmt;
      await doctor.save();

      const newNoti = await Notification.create({
        title: title,
        description: description,
        user_id: appointment.user_id,
      });
      await newNoti.save();
      if (user.fcm_token != "") {
        const message = {
          notification: {
            title: title,
            body: description,
          },
          token: user.fcm_token,
        };
        await admin.messaging().send(message);
      }
      return successResponse(res, result);
    }
  } catch (err) {
    next(err);
  }
};

//Delete Single Appointment
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");

    await Appointment.destroy({
      where: { id: req.params.id },
    });
    deleteResponse(res, "Appointment deleted successfully.");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getPendingAppointment,
  getCompletedAppointment,
  getCancelledAppointment,
};
