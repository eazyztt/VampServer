const crypto = require("crypto");
const db = require("../db");

const encrypt = (plainText, password) => {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto
      .createHash("sha256")
      .update(password)
      .digest("base64")
      .substr(0, 32);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(plainText);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  } catch (error) {
    console.log(error);
  }
};

const hashToDB = async (userId, hash) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  console.log(userId);
  if (!userDoc.exists) {
    console.log("no user");
    return false;
  }
  userRef.update({
    hash: hash,
  });
  return true;
};

const hashFromDB = async (userID) => {
  const userDoc = db.collection("users").doc(userId);
  if (!userDoc.exists) {
    return false;
  }
  const userData = await userDoc.get().data();
  return userData.hash;
};

const decrypt = (encryptedText, password) => {
  try {
    const textParts = encryptedText.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");

    const encryptedData = Buffer.from(textParts.join(":"), "hex");
    const key = crypto
      .createHash("sha256")
      .update(password)
      .digest("base64")
      .substr(0, 32);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    const decrypted = decipher.update(encryptedData);
    const decryptedText = Buffer.concat([decrypted, decipher.final()]);
    return decryptedText.toString();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  encrypt,
  decrypt,
  hashToDB,
  hashFromDB,
};
