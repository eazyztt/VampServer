const db = require("../db");

const generateIdHash = async (userId) => {
  const hash = crypto
    .createHmac("SHA256", process.env.SECRET_KEY_ID)
    .update(string)
    .digest("base64");
  const user = db.collection("users").doc(userId);
  if (!user.exists) {
    return false;
  }
  await user.update({
    hash,
  });

  return true;
};

const idCheckFromURL = (userId, hash) => {
  if (
    hash ===
    crypto
      .createHmac("SHA256", process.env.SECRET_KEY_ID)
      .update(userId)
      .digest("base64")
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  generateIdHash,
  idCheckFromURL,
};
