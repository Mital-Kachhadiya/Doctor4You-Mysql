const express = require("express");
const { Admin } = require("../../models/Admin");
const { Patient } = require("../../models/Patient");
const { createResponse, queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const Appointment = require("../../models/Appointment");
const SpecialistCategory = require("../../models/SpecialistCategory");
const Sequelize = require("sequelize");
const moment = require("moment-timezone");
const { Op } = require("sequelize");

//Get Dashboard Count
const dashboardCountData = async (req, res, next) => {
  try {
    const doctors = await Admin.count({
      where: { role: 2 },
    });
    let patients = await Patient.count();
    let appointments = await Appointment.count();
    const specialistCat = await SpecialistCategory.count();

    if (req.admin.role === "2") {
      // Step 1: Get unique patient IDs from the Appointment table
      const uniquePatientIds = await Appointment.findAll({
        attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("user_id")), "user_id"]],
        where: {
          dr_id: req.admin.id,
        },
        raw: true, // To get plain objects instead of Sequelize instances
      });

      // Extract the patient IDs from the result
      const patientIds = uniquePatientIds.map((item) => item.user_id);

      // Step 2: Get patient details from the Patient table based on the unique patient IDs
      patients = await Patient.count({
        where: {
          [Sequelize.Op.or]: [{ id: patientIds }, { addbydr: req.admin.id }],
        },
      });

      appointments = await Appointment.count({ where: { dr_id: req.admin.id } });
    }

    const resData = {
      patients: patients,
      doctors: doctors,
      appointments: appointments,
      specialistCat: specialistCat,
    };

    successResponse(res, resData);
  } catch (err) {
    next(err);
  }
};

//Get Upcoming Appointment
const getUpcomingAppointment = async (req, res, next) => {
  try {
    const currentDateTime = moment();

    const whereCondition = {
      app_date: {
        [Op.gte]: currentDateTime.format("YYYY-MM-DD"), // Match app_date greater than or equal to current date
      },
      [Op.or]: [
        {
          app_date: {
            [Op.eq]: currentDateTime.format("YYYY-MM-DD"), // Match app_date equal to current date
          },
          app_time: {
            [Op.gte]: currentDateTime.format("HH:mm:ss"), // Match app_time greater than or equal to current time
          },
        },
        {
          app_date: {
            [Op.gt]: currentDateTime.format("YYYY-MM-DD"), // Match app_date greater than current date
          },
        },
      ],
    };

    if (req.admin.role === "2") {
      whereCondition.dr_id = req.admin.id;
    }

    const appointments = await Appointment.findAll({
      include: [
        {
          model: Patient,
          as: "user", // Alias for the User model
          attributes: ["name", "email"], // Specify the attributes you want to include
        },
        {
          model: Admin,
          as: "doctor", // Alias for the Doctor model
          attributes: ["name", "email"], // Specify the attributes you want to include
        },
      ],
      where: whereCondition,
    });

    if (!appointments || appointments.length === 0) {
      return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");
    }

    // Combine the appointment data with user and doctor data
    const enhancedAppointments = appointments.map((appointment) => ({
      ...appointment.dataValues,
      doctor: appointment.doctor || {},
    }));

    successResponse(res, enhancedAppointments);
  } catch (err) {
    next(err);
  }
};

//Get Past Appointment
const getPastAppointment = async (req, res, next) => {
  try {
    const currentDateTime = moment();

    const whereCondition = {
      app_date: {
        [Op.lte]: currentDateTime.format("YYYY-MM-DD"), // Match app_date less than or equal to current date
      },
      [Op.or]: [
        {
          app_date: {
            [Op.eq]: currentDateTime.format("YYYY-MM-DD"), // Match app_date equal to current date
          },
          app_time: {
            [Op.lte]: currentDateTime.format("HH:mm:ss"), // Match app_time less than or equal to current time
          },
        },
        {
          app_date: {
            [Op.lt]: currentDateTime.format("YYYY-MM-DD"), // Match app_date less than current date
          },
        },
      ],
    };

    if (req.admin.role === "2") {
      whereCondition.dr_id = req.admin.id;
    }

    const appointments = await Appointment.findAll({
      include: [
        {
          model: Patient,
          as: "user", // Alias for the User model
          attributes: ["name", "email"], // Specify the attributes you want to include
        },
        {
          model: Admin,
          as: "doctor", // Alias for the Doctor model
          attributes: ["name", "email"], // Specify the attributes you want to include
        },
      ],
      where: whereCondition,
    });

    if (!appointments || appointments.length === 0) {
      return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");
    }

    // Combine the appointment data with user and doctor data
    const enhancedAppointments = appointments.map((appointment) => ({
      ...appointment.dataValues,
      doctor: appointment.doctor || {},
    }));

    successResponse(res, enhancedAppointments);
  } catch (err) {
    next(err);
  }
};

//Get Today Appointment
const getTodayAppointment = async (req, res, next) => {
  try {
    const currentDateTime = moment();

    const whereCondition = {
      app_date: {
        [Op.eq]: currentDateTime.format("YYYY-MM-DD"), // Match app_date equal to current date
      },
    };

    if (req.admin.role === "2") {
      whereCondition.dr_id = req.admin.id;
    }

    const appointments = await Appointment.findAll({
      include: [
        {
          model: Patient,
          as: "user", // Alias for the User model
          attributes: ["name", "email"], // Specify the attributes you want to include
        },
        {
          model: Admin,
          as: "doctor", // Alias for the Doctor model
          attributes: ["name", "email"], // Specify the attributes you want to include
        },
      ],
      where: whereCondition,
    });

    if (!appointments || appointments.length === 0) {
      return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");
    }

    // Combine the appointment data with user and doctor data
    const enhancedAppointments = appointments.map((appointment) => ({
      ...appointment.dataValues,
      doctor: appointment.doctor || {},
    }));

    successResponse(res, enhancedAppointments);
  } catch (err) {
    next(err);
  }
};

// Function to generate an array of dates within the specified range
const generateDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dateRange = [];

  while (startDate <= endDate) {
    dateRange.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }

  return dateRange;
};

// Function to format a date as "dd-mm-yyyy"
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

// Get data for a date range
const getDatewiseAppointments = async (req, res, next) => {
  const { start, end } = req.query;

  try {
    // Generate an array of dates within the range
    const dateRange = generateDateRange(start, end);

    const whereCondition = {
      app_date: {
        [Op.in]: dateRange,
      },
    };

    if (req.admin.role === "2") {
      whereCondition.dr_id = req.admin.id;
    }

    const amountAttribute = req.admin.role === "2" ? "doctor_amount" : "admin_amount";
    // Fetch appointments for the generated date range
    const appointments = await Appointment.findAll({
      attributes: [
        [Sequelize.fn("DATE_FORMAT", Sequelize.col("app_date"), "%d-%m-%Y"), "formattedDate"],
        [Sequelize.fn("COALESCE", Sequelize.fn("SUM", Sequelize.col(amountAttribute)), 0), "totalPaymentAmount"],
      ],
      where: whereCondition,
      group: ["formattedDate"],
    });

    // Convert appointments to object with date keys
    const appointmentMap = appointments.reduce((acc, appointment) => {
      acc[appointment.dataValues.formattedDate] = appointment.dataValues.totalPaymentAmount;
      return acc;
    }, {});

    // Create response including all dates within the range
    const response = dateRange.map((date) => ({
      formattedDate: formatDate(date),
      totalPaymentAmount: appointmentMap[formatDate(date)] || 0,
    }));

    successResponse(res, response);

    // successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  dashboardCountData,
  getUpcomingAppointment,
  getPastAppointment,
  getTodayAppointment,
  getDatewiseAppointments,
};
