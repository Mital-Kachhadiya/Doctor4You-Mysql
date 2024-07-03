const Appointment = require("../../models/Appointment");
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

const Razorpay = require("razorpay");
// Create a Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_iv7qln64k0uOjF",
  key_secret: "dQxXHLHwv5Pcktr8ZG9OE0b1",
});

// Endpoint to generate Razorpay payment URL
// Doctor account details
const doctorAccount = {
  account_number: "DOCTOR_ACCOUNT_NUMBER",
  ifsc: "DOCTOR_IFSC_CODE",
  bank_name: "DOCTOR_BANK_NAME",
  account_holder_name: "DOCTOR_ACCOUNT_HOLDER_NAME",
};

const createPaymentUrl = async (req, res, next) => {
  const amount = 10000; // 100 INR in paise (100 * 100)

  // Calculate amounts for doctor and admin
  const doctorAmount = 8000; // 80 INR in paise
  const adminAmount = 2000; // 20 INR in paise

  try {
    // const order = razorpay.orders.create({
    //   amount: 2000,
    //   currency: "INR",
    //   partial_payment: 0,
    //   transfers: [
    //     {
    //       account: "123456789563214589",
    //       amount: 1000,
    //       currency: "INR",
    //       notes: {
    //         branch: "Acme Corp Bangalore North",
    //         name: "Gaurav Kumar",
    //       },
    //       linked_account_notes: ["branch"],
    //     },
    //     {
    //       account: "123456789563216548",
    //       amount: 1000,
    //       currency: "INR",
    //       notes: {
    //         branch: "Acme Corp Bangalore South",
    //         name: "Saurav Kumar",
    //       },
    //       linked_account_notes: ["branch"],
    //     },
    //   ],
    // });

    const payment = await razorpay.paymentLink.create({
      amount: amount,
      currency: "INR",
      accept_partial: 0,
      description: "For XYZ purpose",
      customer: {
        name: "Mital",
        email: "mk.idea2code@gmail.com",
        contact: "+919000090000",
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        policy_name: "Jeevan Bima",
      },
      callback_url: "https://idea2codeinfotech.com/doctor4you/apis/app/appointment/razorpay-webhook",
      callback_method: "get",
      notes: {
        doctor_amount: doctorAmount / 100, // Convert back to INR for display
        admin_amount: adminAmount / 100, // Convert back to INR for display
        doctor_account_number: doctorAccount.account_number,
        doctor_ifsc_code: doctorAccount.ifsc,
        doctor_bank_name: doctorAccount.bank_name,
        doctor_account_holder_name: doctorAccount.account_holder_name,
      },
    });

    res.json({
      payment: payment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
};

// Endpoint to receive webhook notifications from Razorpay
const razorpayWebhook = async (req, res, next) => {
  const body = req.query;
  console.log(razorpay.payments.transfer);
  // const signature = req.headers["x-razorpay-signature"];
  // console.log(signature, "signature");
  try {
    // Validate the webhook signature
    // const isValidSignature = razorpay.webhooks.verifyWebhookSignature(
    //   JSON.stringify(body),
    //   signature,
    //   "webhookForDoctor4you"
    // );

    // if (isValidSignature) {
    // const payment = body.payload.payment.entity;
    // const { order_id, id: payment_id, amount, notes } = payment;

    // const userAmount = amount - (notes && notes.admin_amount ? notes.admin_amount * 100 : 0);
    // const adminAmount = amount - userAmount;

    // Store payment details in MongoDB
    // const newPayment = new Payment({
    //   order_id,
    //   payment_id,
    //   user_amount: userAmount / 100, // Convert back to INR
    //   admin_amount: adminAmount / 100, // Convert back to INR
    //   status: payment.status,
    // });
    // await newPayment.save();

    // Transfer doctor's amount using Routes API
    // const routeResponse = await razorpay.routes.create({
    //   transfers: [
    //     {
    //       account: "1234567890123456",
    //       amount: 80,
    //       currency: "INR",
    //       reference_id: `transfer_doctor_${order_id}`,
    //     },
    //   ],
    // });

    // Transfer admin's amount to your Razorpay account
    // const adminTransferResponse = await razorpay.routes.create({
    //   transfers: [
    //     {
    //       account: "GUGG5zzNehQEOC",
    //       amount: 20,
    //       currency: "INR",
    //       reference_id: `transfer_admin_${order_id}`,
    //     },
    //   ],
    // });

    // Transfer doctor's amount directly using the Payments API
    // const doctorTransferResponse = await razorpay.payments.transfer({
    //   account: "1234567890123456",
    //   amount: 2,
    //   currency: "INR",
    //   on_hold: false,
    //   notes: {
    //     reference_id: `transfer_doctor`,
    //   },
    // });
    console.log("adminTransferResponse");
    // Transfer admin's amount to your Razorpay account
    // Transfer admin's amount to your Razorpay account

    // const transferResponse = await razorpay.transfers.create({
    //   transfers: [
    //     {
    //       account: "ACCOUNT_ID", // Replace with the account ID you want to transfer to
    //       amount: 100, // Amount in paisa (convert amount to paisa)
    //       currency: "INR",
    //       notes: {
    //         description: "Transfer from successful payment",
    //       },
    //     },
    //   ],
    // });

    const email = "testingdr@gmail.com";
    console.log(razorpay);
    // const existingAccounts = await razorpay.accounts.fetch({ email });
    const response = await razorpay.api.rq.get(`/accounts?email=${email}`);
    console.log(response);
    const account = response.data[0]; // Assuming there is only one account with the given email
    console.log("Account Details:", account);
    // if (existingAccounts.length > 0) {
    //   // If an account already exists, return its account ID
    //   console.log(existingAccounts[0].id, "existingAccounts[0].id");
    // } else {
    //   // If no account exists, create a new linked account
    //   const newAccountResponse = await razorpay.accounts.create({
    //     contact: email,
    //     notes: {
    //       email,
    //       // Add any other information you want to associate with the new account
    //     },
    //   });

    //   // Return the ID of the newly created account
    //   console.log(newAccountResponse.id, "new Acc");
    // }

    // const adminTransferResponse = await razorpay.payments.transfer(req.query.razorpay_payment_id, {
    //   transfers: [
    //     {
    //       account: "acc_O2j1gITAZBUfU4",
    //       amount: 2000,
    //       currency: "INR",
    //       notes: {
    //         name: "ABC Demo",
    //         roll_no: "IEC2011025",
    //       },
    //       on_hold: false,
    //     },
    //   ],
    // });

    // Transfer amount to another account
    // const adminTransferResponse = await razorpay.payments.transfer(req.query.razorpay_payment_id, {
    //   account: "1234567890123456", // Your admin account ID
    //   amount: 500, // Amount in paisa (200 INR)
    //   currency: "INR",
    //   notes: {
    //     reference_id: "transfer_admin",
    //   },
    // });
    // console.log(adminTransferResponse, "adminTransferResponse");

    // console.log("Doctor Amount Transferred Successfully:", doctorTransferResponse);
    // console.log("Admin Amount Transferred Successfully:", adminTransferResponse);
    res.status(200).send("Webhook Received");
    // } else {
    //   console.log("Invalid Signature");
    //   res.status(400).send("Invalid Webhook Signature");
    // }
  } catch (err) {
    console.error(err);
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
  razorpayWebhook,
};
