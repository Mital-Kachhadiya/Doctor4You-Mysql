const Faq = require("../../models/Faq");
const { Patient } = require("../../models/Patient");
const HelpCenter = require("../../models/HelpCenter");
const GeneralSettings = require("../../models/GeneralSettings");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");

//Add FAQs
const addfaqs = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    const newFaqs = await Faq.create({
      question,
      answer,
    });
    const result = await newFaqs.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Get All FAQs
const getAllFaqs = async (req, res, next) => {
  try {
    const faq = await Faq.findAll();
    if (!faq) return queryErrorRelatedResponse(req, res, 404, "FAQs not found.");
    successResponse(res, faq);
  } catch (err) {
    next(err);
  }
};

//Update FAQs
const updateFaq = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    const faqs = await Faq.findByPk(req.params.id);
    if (!faqs) return queryErrorRelatedResponse(req, res, 404, "FAQs not found.");

    faqs.question = question;
    faqs.answer = answer;
    const result = await faqs.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update FAQs Status
const updateFaqStatus = async (req, res, next) => {
  try {
    // Convert string is into Object id
    const id = req.params.id;
    const faq = await Faq.findByPk(id);
    if (!faq) return queryErrorRelatedResponse(req, res, 404, "FAQs not found.");

    faq.status = !faq.status;
    const result = await faq.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Delete Single FAQ
const deletefaq = async (req, res, next) => {
  try {
    const id = req.params.id;
    const faq = await Faq.findByPk(id);
    if (!faq) return queryErrorRelatedResponse(req, res, 404, "FAQs not found.");

    await Faq.destroy({
      where: { id: id },
    });
    deleteResponse(res, "FAQ deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Delete Multiple FAQs
const deleteMultFaq = async (req, res, next) => {
  try {
    const { Ids } = req.body;
    Ids.map(async (item) => {
      await Faq.destroy({ where: { id: item } });
    });
    deleteResponse(res, "All selected records deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Add General Settings
const addGeneralSettings = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const newpp = await GeneralSettings.create({
      email,
      password,
    });
    const result = await newpp.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update General Settings
const updateGeneralSetting = async (req, res, next) => {
  try {
    const { email, password, admin_charges, razorpay_key_id, razorpay_key_secret } = req.body;
    const pp = await GeneralSettings.findByPk(req.params.id);
    if (!pp) return queryErrorRelatedResponse(req, res, 404, "Data not found.");

    pp.email = email;
    pp.password = password;
    pp.admin_charges = admin_charges;
    pp.razorpay_key_id = razorpay_key_id;
    pp.razorpay_key_secret = razorpay_key_secret;
    let result = await pp.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Get  General Settings
const getGeneralSettings = async (req, res, next) => {
  try {
    const pp = await GeneralSettings.findOne();
    if (!pp) return queryErrorRelatedResponse(req, res, 404, "Data not found.");
    successResponse(res, pp);
  } catch (err) {
    next(err);
  }
};

// Get Customer Issue
const customerIssue = async (req, res, next) => {
  try {
    const issues = await HelpCenter.findAll({
      include: [
        {
          model: Patient,
          as: "user", // Alias for the User model
          attributes: ["id", "name", "email"], // Specify the attributes you want to include
        },
      ],
    });
    successResponse(res, issues);
  } catch (error) {
    next(error);
  }
};

//Update Customer Issue Status
const updateCustomerIssueStatus = async (req, res, next) => {
  try {
    const issue = await HelpCenter.findByPk(req.params.id);
    if (!issue) return queryErrorRelatedResponse(req, res, 404, "issue not found.");
    issue.status = !issue.status;
    const result = await issue.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addfaqs,
  getAllFaqs,
  updateFaq,
  updateFaqStatus,
  deleteMultFaq,
  deletefaq,
  getGeneralSettings,
  addGeneralSettings,
  updateGeneralSetting,
  customerIssue,
  updateCustomerIssueStatus,
};
