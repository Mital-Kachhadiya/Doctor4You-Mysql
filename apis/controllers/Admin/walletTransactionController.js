const Faq = require("../../models/Faq");
const { Admin } = require("../../models/Admin");
const WalletTransaction = require("../../models/WalletTransaction");
const GeneralSettings = require("../../models/GeneralSettings");
const Appointment = require("../../models/Appointment");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");
const createRazorpayInstance = require("../../helper/razorpay");
const moment = require("moment");
const axios = require("axios");

//Get All Wallet Transactions
const getAllTransactions = async (req, res, next) => {
  try {
    let whereCondition = {};

    if (req.admin.role === "2") {
      // If the role is 2, include the where condition with dr_id
      whereCondition = {
        dr_id: req.admin.id,
      };
    }

    const transactions = await WalletTransaction.findAll({
      include: [
        {
          model: Appointment,
          as: "appointment", // Alias for the User model
          attributes: ["id", "appointment_id"], // Specify the attributes you want to include
        },
        {
          model: Admin,
          as: "doctor", // Alias for the Doctor model
          attributes: ["id", "name", "email", "mo_no", "image"], // Specify the attributes you want to include
        },
      ],
      where: whereCondition, // Apply the where condition based on the role
    });
    if (!transactions) return queryErrorRelatedResponse(req, res, 404, "Transactions not found.");

    const transformedInfo = [];

    for (const item of transactions) {
      const transformedItem = {
        id: item.id,
        transaction_id: item.transaction_id,
        amount: item.amount,
        status: item.status,
        createdAt: moment(item.createdAt).format("DD-MM-YYYY"),
        dr_id: item.dr_id,
        doctor_name: item.doctor.name,
        doctor_email: item.doctor.email,
        doctor_mo_no: item.doctor.mo_no,
        doctor_image: item.doctor.image,
        appointment_id: item.appointment_id,
        app_id: item.appointment ? item.appointment.appointment_id : "",
      };

      transformedInfo.push(transformedItem);
    }

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_USER_PATH;

    const modifiedRes = {
      transactions: transformedInfo,
      baseUrl: `${baseUrl}`,
    };
    successResponse(res, modifiedRes);
  } catch (err) {
    next(err);
  }
};

//Send Withdrawal Request
const sendWithdrawalReq = async (req, res, next) => {
  try {
    const { amount, dr_id } = req.body;

    const doctor = await Admin.findByPk(dr_id);
    if (!doctor) return queryErrorRelatedResponse(req, res, 404, "Invalid Doctor");

    if (doctor.wallet_amount * 100 < amount) {
      return queryErrorRelatedResponse(
        req,
        res,
        404,
        "Insufficient Funds.Your withdrawal request exceeds the available balance in your wallet. Please enter a lower amount or check your balance and try again."
      );
    }

    const razorpayData = await GeneralSettings.findOne();
    const razorpay = createRazorpayInstance(razorpayData.razorpay_key_id, razorpayData.razorpay_key_secret);

    const requestData = {
      account_number: "2323230038439095",
      amount: 100,
      currency: "INR",
      mode: "NEFT",
      purpose: "payout",
      fund_account: {
        account_type: "bank_account",
        bank_account: {
          name: "Gaurav Kumar",
          ifsc: "HDFC0001234",
          account_number: "1121431121541121",
        },
        contact: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9876543210",
          type: "employee",
          reference_id: "Acme Contact ID 12345",
          notes: {
            notes_key_1: "Tea, Earl Grey, Hot",
            notes_key_2: "Tea, Earl Grey… decaf.",
          },
        },
      },
      queue_if_low_balance: true,
      reference_id: "Acme Transaction ID 12345",
      narration: "Acme Corp Fund Transfer",
      notes: {
        notes_key_1: "Beam me up Scotty",
        notes_key_2: "Engage",
      },
    };

    axios({
      method: "post",
      url: "https://api.razorpay.com/v1/payouts",
      data: requestData,
      auth: {
        username: razorpayData.razorpay_key_id,
        password: razorpayData.razorpay_key_secret,
      },
    })
      .then((response) => {
        console.log("Response:", response);
        return createResponse(res, response.id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // const withdrawal = await razorpay.transfers.create({
    //   account_number: "1234567890",
    //   amount, // Amount to withdraw in paise (e.g., 1000 for ₹10)
    //   currency: "INR", // Currency code (e.g., 'INR' for Indian Rupees)
    //   mode: "NEFT", // Withdrawal mode ('IMPS' or 'NEFT')
    //   bank_code: "HDFC0000317", // Recipient's bank IFSC code
    //   notes: {
    //     recipient_id: dr_id, // Custom identifier for the recipient
    //   },
    //   on_hold: false, // Whether to keep the transfer on hold or not
    // });

    // return withdrawal;

    // const response = await axios.post(
    //   "https://api.razorpay.com/v1/payouts",
    //   {
    //     account_number: "000111222333",
    //     amount: amount,
    //     currency: "INR",
    //     mode: "NEFT", // NEFT or IMPS
    //     method: "bank_transfer",
    //     recipient_id: dr_id,
    //     bank_code: "SBIN0000001",
    //   },
    //   {
    //     auth: {
    //       username: razorpay.razorpay_key_id,
    //       password: razorpay.razorpay_key_secret,
    //     },
    //   }
    // );

    // return createResponse(res, withdrawal);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTransactions,
  sendWithdrawalReq,
};
