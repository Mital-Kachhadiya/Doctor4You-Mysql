const express = require("express");
const router = express.Router();
const { getAllTransactions, sendWithdrawalReq } = require("../../controllers/Admin/walletTransactionController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.get("/getAllTransactions", authenticAdmin, getAllTransactions);
router.post("/sendWithdrawalReq", authenticAdmin, sendWithdrawalReq);

module.exports = router;
