const { Patient, generateAuthToken, generateRefreshToken } = require("../../models/Patient");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");
const Appointment = require("../../models/Appointment");
const Sequelize = require("sequelize");

//Add Patient
const addPatient = async (req, res, next) => {
  try {
    const addedData = req.body;

    addedData.password = "123456";
    addedData.role = 1;

    if (req.admin.role === "2") {
      addedData.addbydr = req.admin.id;
    }
    if (req.file) {
      addedData.image = req.file.filename;
    }
    const patient = await new Patient(addedData);
    const result = await patient.save();

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PATIENT_PATH;
    const resData = {
      patient: result,
      baseUrl,
    };

    successResponse(res, resData);
  } catch (err) {
    next(err);
  }
};

//Get All Patient
const getAllPatient = async (req, res, next) => {
  let patients; // Declare patients variable outside the if block
  try {
    if (req.admin.role === "1") {
      patients = await Patient.findAll();
      if (!patients) return queryErrorRelatedResponse(req, res, 404, "Patients not found.");
    } else {
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
      patients = await Patient.findAll({
        where: {
          [Sequelize.Op.or]: [{ id: patientIds }, { addbydr: req.admin.id }],
        },
      });
    }

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PATIENT_PATH;
    const modifiedRes = {
      patients: patients,
      baseUrl: `${baseUrl}`,
    };

    successResponse(res, modifiedRes);
  } catch (err) {
    next(err);
  }
};

//Update Patient
const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return queryErrorRelatedResponse(req, res, 404, "Patient not found.");

    const updatedData = req.body;
    updatedData.image = patient.image;
    if (req.file) {
      deleteFiles("patient/" + patient.image);
      updatedData.image = req.file.filename;
    }

    const [updatedRowsCount, updatedPatient] = await Patient.update(updatedData, {
      where: { id: req.params.id },
      returning: true, // This option is to return the updated record(s)
    });
    if (updatedRowsCount < 0) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const result = await Patient.findByPk(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Patient Status
const updatePatientStatus = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return queryErrorRelatedResponse(req, res, 404, "Patient not found.");

    patient.status = !patient.status;
    const result = await patient.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Delete Single Patient
const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return queryErrorRelatedResponse(req, res, 404, "Patient not found.");
    deleteFiles("patient/" + patient.image);
    await Patient.destroy({
      where: { id: req.params.id },
    });

    await Appointment.destroy({
      where: { user_id: req.params.id },
    });
    deleteResponse(res, "Patient deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Delete Multiple Patient
const deleteMultPatient = async (req, res, next) => {
  try {
    const { Ids } = req.body;
    Ids.map(async (item) => {
      const patient = await Patient.findByPk(item);
      if (!patient) return queryErrorRelatedResponse(req, res, 404, "Patient not found.");
      deleteFiles("patient/" + patient.image);

      await Patient.destroy({
        where: { id: item },
      });

      await Appointment.destroy({
        where: { user_id: item },
      });
    });
    deleteResponse(res, "All selected records deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Get Patient By ID
const getPatientByid = async (req, res, next) => {
  try {
    const doc = await Patient.findOne({
      where: { id: req.params.id },
    });
    if (!doc) return queryErrorRelatedResponse(req, res, 404, "Doctors not found.");

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PATIENT_PATH;
    const modifiedRes = {
      patients: doc,
      baseUrl: `${baseUrl}`,
    };

    successResponse(res, modifiedRes);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addPatient,
  getAllPatient,
  updatePatient,
  updatePatientStatus,
  deletePatient,
  deleteMultPatient,
  getPatientByid,
};
