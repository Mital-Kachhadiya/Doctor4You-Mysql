const express = require("express");
const sequelize = require("./dbConnection");
const app = express();
const port = 5056;
const path = require("path");
const cors = require("cors");
var bodyParser = require("body-parser");

// cors configurations
app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
// Trust proxy headers
app.set("trust proxy", true);
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get error controller
const errorController = require("./helper/errorController");

const moment = require("moment-timezone");

const timezone = "Asia/Kolkata";
moment.tz.setDefault(timezone);
// const Admin = require("./models/Admin"); // Adjust the path accordingly

// Sync the model with the database
sequelize.sync();

// Define static files
app.use("/public/user", express.static(path.join(__dirname, "./public/images/user")));
app.use("/public/specialistCategory", express.static(path.join(__dirname, "./public/images/SpecialistCategory")));
app.use("/public/patient", express.static(path.join(__dirname, "./public/images/patient")));

// Register the Admin Panel Routes
const adminRoutes = require("./routes/admin");
app.use(adminRoutes);

// Register the Admin Panel Routes
const appRoutes = require("./routes/app");
app.use(appRoutes);

// Error handling middleware
app.use(errorController);

// Close the MySQL connection when the app is terminated
// process.on("SIGINT", () => {
//   sequelize.end();
//   process.exit();
// });

const cron = require("node-cron");
const { Patient } = require("./models/Patient");
const { Admin } = require("./models/Admin");
const Appointment = require("./models/Appointment");
const Notification = require("./models/Notification");
const { Op } = require("sequelize");
const admin = require("firebase-admin");
const serviceAccount = require("./config/doctor4you-firebase-adminsdk.json");

admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
  },
  "CRON_APP"
);

// Cron job to be executed every day at 12 PM
cron.schedule("0 12 * * *", async function () {
  const patients = await Patient.findAll({ where: { status: 1, role: 1 } });
  if (!patients) return queryErrorRelatedResponse(req, res, 404, "Patients not found.");

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const formattedTomorrow = tomorrowDate.toISOString().split("T")[0];
  patients.map(async (patient) => {
    let appointments = await Appointment.findAll({
      where: {
        user_id: patient.id,
        status: 0,
        app_date: formattedTomorrow, // Exactly tomorrow's date
      },
      include: [
        {
          model: Patient,
          as: "user",
          attributes: ["id", "fcm_token", "email", "name"],
        },
        {
          model: Admin,
          as: "doctor",
          attributes: ["id", "name"],
        },
      ],
    });

    appointments.map(async (appointment) => {
      const newNoti = await Notification.create({
        title: "Appointment Alarm",
        description: `Dear ${appointment.user.name}, This is a gentle reminder that you have an appointment scheduled with  Dr. ${appointment.doctor.name} tomorrow.`,
        user_id: appointment.user.id,
      });
      await newNoti.save();
      if (appointment.user.fcm_token != "") {
        const message = {
          notification: {
            title: "Appointment Alarm",
            body: `Dear ${appointment.user.name}, This is a gentle reminder that you have an appointment scheduled with  Dr. ${appointment.doctor.name} tomorrow.`,
          },
          token: appointment.user.fcm_token,
        };

        await admin.messaging().send(message);
      }
    });
  });
});

// Cron job to be executed every 1 minute
cron.schedule("*/1 * * * *", async function () {
  const patients = await Patient.findAll({ where: { status: 1, role: 1 } });
  if (!patients) return queryErrorRelatedResponse(req, res, 404, "Patients not found.");

  const currentDate = new Date();
  const currentDateTime = moment();
  const formattedToday = currentDateTime.format("YYYY-MM-DD");
  const currentTime = currentDate.getHours() * 3600 + currentDate.getMinutes() * 60 + currentDate.getSeconds();
  const fifteenMinutesLater = new Date(currentDate.getTime() + 15 * 60000); // Add 15 minutes

  const formattedTime =
    ("0" + fifteenMinutesLater.getHours()).slice(-2) +
    ":" +
    ("0" + fifteenMinutesLater.getMinutes()).slice(-2) +
    ":" +
    ("0" + fifteenMinutesLater.getSeconds()).slice(-2);

  patients.map(async (patient) => {
    let appointments = await Appointment.findAll({
      where: {
        user_id: patient.id,
        status: 0,
        app_date: formattedToday, // Exactly today date
        app_time: formattedTime, // Exactly 15 minutes after the current time
      },
      include: [
        {
          model: Patient,
          as: "user",
          attributes: ["id", "fcm_token", "email", "name"],
        },
        {
          model: Admin,
          as: "doctor",
          attributes: ["id", "name"],
        },
      ],
    });

    appointments.map(async (appointment) => {
      const newNoti = await Notification.create({
        title: "Appointment Alarm",
        description: `Dear ${appointment.user.name}, Your appointment will be start after 15 min with Dr. ${appointment.doctor.name}. Stay with app and take care`,
        user_id: appointment.user.id,
      });
      await newNoti.save();

      if (appointment.user.fcm_token != "") {
        const message = {
          notification: {
            title: "Appointment Alarm",
            body: `Dear ${appointment.user.name}, Your appointment will be start after 15 min with Dr. ${appointment.doctor.name}. Stay with app and take care`,
          },
          token: appointment.user.fcm_token,
        };

        await admin.messaging().send(message);
      }
    });
  });
});
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
