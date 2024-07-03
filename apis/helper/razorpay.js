const createRazorpayInstance = (key_id, key_secret) => {
  const Razorpay = require("razorpay");

  if (!key_id || !key_secret) {
    throw new Error("Razorpay key_id and key_secret are required.");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

module.exports = createRazorpayInstance;
