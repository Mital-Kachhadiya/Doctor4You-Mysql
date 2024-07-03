const Appointment = require("../../models/Appointment");
const GeneralSettings = require("../../models/GeneralSettings");
const Patient = require("../../models/Patient");
const { Admin } = require("../../models/Admin");
const { Op } = require("sequelize");

const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");
const { generateUniqueID } = require("../../helper/uniqueId");
const moment = require("moment-timezone");
const createRazorpayInstance = require("../../helper/razorpay");

const createPaymentUrl = async (req, res, next) => {
  try {
    const formattedTime = moment(req.body.app_time, "hh:mm A").format("HH:mm:ss");
    req.body.app_time = formattedTime;
    console.log(formattedTime);
    const appointment = await Appointment.findOne({
      where: {
        app_date: req.body.app_date,
        app_time: req.body.app_time,
        dr_id: req.body.dr_id,
        status: { [Op.not]: 4 },
      },
    });
    if (appointment) {
      return queryErrorRelatedResponse(req, res, 203, "Appointment slot already booked");
    } else {
      req.body.appointment_id = generateUniqueID();
      const razorpayData = await GeneralSettings.findOne();
      const razorpay = createRazorpayInstance(razorpayData.razorpay_key_id, razorpayData.razorpay_key_secret);
      const payment = await razorpay.paymentLink.create({
        amount: req.body.payment_amount * 100,
        currency: "INR",
        accept_partial: 0,
        reference_id: req.body.appointment_id,
        description: "Doctor Appointment - #" + req.body.appointment_id,
        customer: {
          name: req.body.name,
          contact: req.body.mo_no,
        },
        // notify: {
        //   sms: true,
        //   email: true,
        // },
        // reminder_enable: true,
        callback_url: "https://idea2codeinfotech.com/doctor4you/apis/app/appointment/callback",
        callback_method: "get",
        notes: {
          charges_description:
            "The administrative charges are calculated at a rate of " +
            req.body.admin_charges +
            "% of the total amount. Therefore, the doctor's payment for this transaction amounts will be " +
            req.body.doctor_amount +
            " Rs.",
          admin_amount: req.body.admin_amount,
          doctor_amount: req.body.doctor_amount,
        },
      });

      if (payment.status) {
        const newApp = await new Appointment(req.body);
        const result = await newApp.save();
      }

      return createResponse(res, { payment_url: payment.short_url, callback_url: payment.callback_url });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
};

// Endpoint to receive webhook notifications from Razorpay
const callback = async (req, res, next) => {
  const body = req.query;

  try {
    // Verify payment status
    const paymentStatus = body.razorpay_payment_link_status;
    if (paymentStatus === "paid") {
      const app = await Appointment.findOne({ where: { appointment_id: body.razorpay_payment_link_reference_id } });
      if (!app) return queryErrorRelatedResponse(req, res, 404, "Invalid Appointment.");

      // Update transaction records
      const paymentId = body.razorpay_payment_id;
      const razorpayData = await GeneralSettings.findOne();
      const razorpay = createRazorpayInstance(razorpayData.razorpay_key_id, razorpayData.razorpay_key_secret);

      const paymentData = await razorpay.payments.fetch(paymentId);
      const orderId = paymentData.order_id;

      app.order_id = orderId;
      app.payment_id = paymentId;
      app.status = 0;
      app.payment_status = 1;
      app.save();

      successResponse(res, { message: "Payment processed successfully." });
    } else {
      res.status(400).send("Payment processing failed.");
    }
  } catch (err) {
    res.status(500).send("Error processing webhook");
  }
};

//Add Appointment
const addAppointment = async (req, res, next) => {
  try {
    const formattedTime = moment(req.body.app_time, "hh:mm A").format("HH:mm:ss");
    req.body.app_time = formattedTime;
    console.log(formattedTime);
    const appointment = await Appointment.findOne({
      where: { app_date: req.body.app_date, app_time: req.body.app_time, dr_id: req.body.dr_id },
    });
    if (appointment) {
      return queryErrorRelatedResponse(req, res, 203, "Appointment slot already booked");
    } else {
      req.body.appointment_id = generateUniqueID();

      const newApp = await new Appointment(req.body);
      const result = await newApp.save();
      return createResponse(res, result);
    }
  } catch (err) {
    next(err);
  }
};

//Add Appointment Review
const addAppReview = async (req, res, next) => {
  try {
    //Find Banner by params id
    const appointment = await Appointment.findByPk(req.body.id);
    if (!appointment) return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");

    const updatedData = req.body;

    const [updatedRowsCount, updatedCount] = await Appointment.update(updatedData, {
      where: { id: req.body.id },
      returning: true, // This option is to return the updated record(s)
    });

    if (updatedRowsCount < 0) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const resData = await Appointment.findByPk(req.body.id);

    successResponse(res, resData);
  } catch (err) {
    next(err);
  }
};

//Get Upcoming Appointment
const getUpcomingAppointment = async (req, res, next) => {
  try {
    const currentDateTime = moment();

    const appointments = await Appointment.findAll({
      include: [
        {
          model: Admin,
          as: "doctor", // Alias for the Doctor model
        },
      ],
      where: {
        user_id: req.patient.id,
        status: { [Op.ne]: 4 },
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
        // app_date: {
        //   [Op.gte]: currentDateTime.format("YYYY-MM-DD"), // Match app_date greater than or equal to current date
        // },
        // app_time: {
        //   [Op.gte]: currentDateTime.format("HH:mm:ss"), // Match app_time greater than or equal to current time
        // },
      },
    });

    if (!appointments || appointments.length === 0) {
      return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");
    }

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;

    // Combine the appointment data with user and doctor data
    const enhancedAppointments = appointments.map((appointment) => ({
      ...appointment.dataValues,
      doctor: appointment.doctor || {},
      baseUrl: baseUrl,
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

    const appointments = await Appointment.findAll({
      include: [
        {
          model: Admin,
          as: "doctor", // Alias for the Doctor model
        },
      ],
      where: {
        user_id: req.patient.id,
        status: { [Op.ne]: 4 },
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
        // app_date: {
        //   [Op.lte]: currentDateTime.format("YYYY-MM-DD"), // Match app_date greater than or equal to current date
        // },
        // app_time: {
        //   [Op.lte]: currentDateTime.format("HH:mm:ss"), // Match app_time greater than or equal to current time
        // },
      },
    });

    if (!appointments || appointments.length === 0) {
      return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");
    }

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;
    // Combine the appointment data with user and doctor data
    const enhancedAppointments = appointments.map((appointment) => ({
      ...appointment.dataValues,
      doctor: appointment.doctor || {},
      baseUrl: baseUrl,
    }));

    successResponse(res, enhancedAppointments);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addAppointment,
  addAppReview,
  getUpcomingAppointment,
  getPastAppointment,
  createPaymentUrl,
  callback,
};
