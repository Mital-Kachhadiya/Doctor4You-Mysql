const crypto = require("crypto");

const generateUniqueID = () => {
  // Generate a random 3-byte (24-bit) number
  const randomBytes = crypto.randomBytes(3);

  // Convert the randomBytes to a 6-digit hexadecimal string
  const hexString = randomBytes.toString("hex");

  // Convert hexadecimal to decimal and take the last 6 digits
  const decimalNumber = parseInt(hexString, 16) % 1000000;

  // Ensure it is exactly 6 digits by padding with zeros if needed
  const sixDigitID = decimalNumber.toString().padStart(6, "0");

  return sixDigitID;
};

module.exports = { generateUniqueID };
