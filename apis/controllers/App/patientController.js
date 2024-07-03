const { Patient, generateAuthToken, generateRefreshToken } = require("../../models/Patient");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Favorite = require("../../models/Favorite");

//Patient Register
const RegisterPatient = async (req, res, next) => {
  try {
    const { name, email, password, mo_no, role } = req.body;

    const patient = await Patient.findOne({ where: { mo_no: req.body.mo_no } });
    if (patient) return queryErrorRelatedResponse(req, res, 401, "Mobile No already exist!");

    const newData = await Patient.create({
      name,
      email,
      password,
      mo_no,
      role,
    });

    const token = generateAuthToken(newData, { email: req.body.email });
    const refresh_token = generateRefreshToken(newData, { email: req.body.email });

    newData.remember_token = token;
    newData.refresh_token = refresh_token;

    await newData.save();
    // Save Admin and response
    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PATIENT_PATH;
    const tokens = {
      token,
      refresh_token,
      admin: newData,
      baseUrl,
    };
    successResponse(res, tokens);
  } catch (err) {
    console.error(err); // Log the error for debugging
    next(err);
  }
};

//Patient Signin
const signinPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ where: { email: req.body.email } });
    if (!patient) return queryErrorRelatedResponse(req, res, 401, "Invalid Email Id!");

    const validatePassword = await bcrypt.compare(req.body.password, patient.password);
    if (!validatePassword) return queryErrorRelatedResponse(req, res, 401, "Invalid Password!");

    if (patient.status === false)
      return queryErrorRelatedResponse(req, res, 401, "Your account has been suspended!! Please contact to admin.");

    const accessToken = jwt.sign({ email: patient.email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    patient.remember_token = accessToken;
    patient.fcm_token = req.body.fcm_token;

    const refresh_token = jwt.sign({ email: patient.email }, process.env.REFRESH_TOKEN_SECRET);

    const output = await patient.save();

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PATIENT_PATH;
    // Assuming you have a `baseUrl` variable
    const userWithBaseUrl = {
      patient: output,
      baseUrl: baseUrl,
      refresh_token: refresh_token,
    };

    successResponse(res, userWithBaseUrl);
  } catch (err) {
    next(err);
  }
};

//Facebook & Google Login
const socialLogin = async (req, res, next) => {
  try {
    const accessToken = jwt.sign({ email: req.body.email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const refresh_token = jwt.sign({ email: req.body.email }, process.env.REFRESH_TOKEN_SECRET);
    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;

    const patient = await Patient.findOne({ where: { email: req.body.email } });

    if (!patient) {
      const newpatient = await new Patient({
        name: req.body.name,
        email: req.body.email,
        fcm_token: req.body.fcm_token,
        remember_token: accessToken,
        refresh_token: refresh_token,
        mo_no: null,
      });
      const addedpatient = await newpatient.save();

      const patientWithBaseUrl = {
        patient: addedpatient,
        baseUrl: baseUrl,
        refresh_token: refresh_token,
        loginStatus: 0,
      };
      createResponse(res, patientWithBaseUrl);
    } else {
      patient.remember_token = accessToken;
      patient.refresh_token = refresh_token;
      patient.fcm_token = req.body.fcm_token;

      await patient.save();

      const patientWithBaseUrl = {
        patient: patient,
        baseUrl: baseUrl,
        refresh_token: refresh_token,
        loginStatus: 1,
      };

      createResponse(res, patientWithBaseUrl);
    }
  } catch (err) {
    next(err);
  }
};

//Update Patient Profile
const updatePatientProfile = async (req, res, next) => {
  try {
    //Find Banner by params id
    const patient = await Patient.findByPk(req.patient.id);
    if (!patient) return queryErrorRelatedResponse(req, res, 404, "Patient not found.");

    const updatedData = req.body;

    if (req.body.dob) {
      const dateOfBirth = new Date(req.body.dob);
      updatedData.dob = dateOfBirth.getTime();
      console.log(dateOfBirth.getTime());
    }

    updatedData.image = patient.image;
    if (req.file) {
      deleteFiles(patient.image);
      updatedData.image = req.file.filename;
    }

    const [updatedRowsCount, updatedPatient] = await Patient.update(updatedData, {
      where: { id: req.patient.id },
      returning: true, // This option is to return the updated record(s)
    });

    if (updatedRowsCount < 0) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const updatedUser = await Patient.findByPk(req.patient.id);

    // Save Admin and response
    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PATIENT_PATH;
    const resData = {
      patient: updatedUser,
      baseUrl,
    };
    successResponse(res, resData);
  } catch (err) {
    next(err);
  }
};

//Forgot Password - Check Mobile No
const checkMoNo = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ where: { mo_no: req.body.mo_no } });
    if (!patient) return queryErrorRelatedResponse(req, res, 401, "Invalid Mobile No!");

    var otp = Math.floor(1000 + Math.random() * 9000);
    patient.otp = otp;
    patient.expireOtpTime = Date.now() + 300000; //Valid upto 5 min
    await patient.save();

    successResponse(res, patient);
  } catch (err) {
    next(err);
  }
};

//Forgot Password - Check OTP
const checkPatientOtp = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ where: { otp: req.body.otp, mo_no: req.body.mo_no } });
    if (!patient) return queryErrorRelatedResponse(req, res, 401, "Invalid OTP!");

    if (new Date(patient.expireOtpTime).toTimeString() <= new Date(Date.now()).toTimeString()) {
      return queryErrorRelatedResponse(req, res, 401, "OTP is Expired!");
    }

    successResponse(res, patient);
  } catch (err) {
    next(err);
  }
};

//Forgot Password - Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ where: { mo_no: req.body.mo_no } });
    if (!patient) return queryErrorRelatedResponse(req, res, 401, "Invalid Mobile No!");

    if (req.body.new_pass !== req.body.confirm_pass) {
      return queryErrorRelatedResponse(req, res, 401, "Confirm Password does not match!");
    }

    patient.otp = null;
    patient.password = req.body.new_pass;
    await patient.save();

    successResponse(res, "Your password has been change.");
  } catch (err) {
    next(err);
  }
};

//Like/Dislike Doctor
const likeDr = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.patient.id);
    if (!patient) return queryErrorRelatedResponse(req, res, 401, "Invalid Patient!");

    const favorite = await Favorite.findOne({ where: { user_id: req.patient.id, dr_id: req.body.dr_id } });
    if (favorite) {
      await favorite.destroy({
        where: { user_id: req.patient.id, dr_id: req.body.dr_id },
      });
      successResponse(res, "DisLike");
    } else {
      const newData = await new Favorite({ user_id: req.patient.id, dr_id: req.body.dr_id });
      const result = await newData.save();
      successResponse(res, "Like");
    }
  } catch (err) {
    next(err);
  }
};

//Get RefreshToken
const RefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(402).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await Patient.findOne({ email: decoded.email });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid Username!");

    const token = jwt.sign({ email: decoded.email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    successResponse(res, token);
  } catch (err) {
    next(err);
  }
};

const PatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ where: { id: req.body.id } });
    if (!patient) return queryErrorRelatedResponse(req, res, 401, "Invalid Id!");

    if (patient.status === false)
      return queryErrorRelatedResponse(req, res, 401, "Your account has been suspended!! Please contact to admin.");

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PATIENT_PATH;
    // Assuming you have a `baseUrl` variable
    const userWithBaseUrl = {
      patient: patient,
      baseUrl: baseUrl,
    };

    successResponse(res, userWithBaseUrl);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  RegisterPatient,
  updatePatientProfile,
  signinPatient,
  socialLogin,
  checkMoNo,
  checkPatientOtp,
  resetPassword,
  likeDr,
  RefreshToken,
  PatientById,
};
