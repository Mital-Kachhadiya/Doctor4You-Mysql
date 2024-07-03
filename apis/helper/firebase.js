const admin = require("firebase-admin");
const serviceAccount = require("../config/doctor4you-firebase-adminsdk.json");

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = initializeFirebaseAdmin;
