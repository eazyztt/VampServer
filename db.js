const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./vamp-server-firebase-adminsdk-v6brx-c1683a6373.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
