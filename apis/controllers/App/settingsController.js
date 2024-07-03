const Faqs = require("../../models/Faq");
const HelpCenter = require("../../models/HelpCenter");
const { sendMail } = require("../../helper/emailSender");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const { Patient } = require("../../models/Patient");
const GeneralSettings = require("../../models/GeneralSettings");
const { Admin } = require("../../models/Admin");

//Get Active FAQs
const getAllFaqs = async (req, res, next) => {
  try {
    const faq = await Faqs.findAll({ where: { status: true } });
    if (!faq) return queryErrorRelatedResponse(req, res, 404, "FAQs not found.");

    successResponse(res, faq);
  } catch (err) {
    next(err);
  }
};

//Send Mail to Helpcenter
const SendHelpMail = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.patient.id);
    if (!patient) return queryErrorRelatedResponse(req, res, 404, "Patient not found.");

    const newhelp = await new HelpCenter({
      user_id: req.patient.id,
      question: req.body.question,
    });
    const helpcenter = await newhelp.save();

    const emailData = await GeneralSettings.findOne();
    if (!emailData) return queryErrorRelatedResponse(req, res, 404, "Data not found.");

    const mailStatus = sendMail({
      AuthEmail: emailData.email,
      AuthPass: emailData.password,
      from: patient.email,
      to: emailData.email,
      sub: "Doctor4You - Help Center - Issue Report",
      htmlFile: "./emailTemplate/helpcenter.html",
      extraData: {
        username: patient.name,
        useremail: patient.email,
        usermo: patient.mo_no,
        question: req.body.question,
      },
    });
    console.log(mailStatus, "mailStatus");
    successResponse(res, "Your request has been send successfully. We will respond you as soon as possible.");
  } catch (err) {
    next(err);
  }
};

//Get Admin Commission
const getAdminCommission = async (req, res, next) => {
  try {
    const doc = await GeneralSettings.findOne({
      where: { id: 1 },
      attributes: ["admin_charges"],
    });
    if (!doc) return queryErrorRelatedResponse(req, res, 404, "Admin Commission not found.");

    successResponse(res, doc);
  } catch (err) {
    next(err);
  }
};

//Get Admin Bank Info
const getAdminBankInfo = async (req, res, next) => {
  try {
    const doc = await Admin.findOne({
      where: { id: 1 },
      attributes: ["bank_name", "acc_holder_name", "acc_number", "ifsc_code"],
    });
    if (!doc) return queryErrorRelatedResponse(req, res, 404, "Admin Bank Info not found.");

    successResponse(res, doc);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllFaqs,
  SendHelpMail,
  getAdminCommission,
  getAdminBankInfo,
};
