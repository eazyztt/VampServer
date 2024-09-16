const crypto = require("crypto");
require("dotenv").config();

const verifyInitData = (telegramInitData) => {
  const urlParams = new URLSearchParams(telegramInitData);
  console.log(urlParams);

  //console.log(urlParams);
  let username = urlParams.get("user").split(",")[3].split(":")[1];
  let id = urlParams.get("user").split(",")[0].split(":")[1];
  username = username.slice(1, -1);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");
  urlParams.sort();

  let dataCheckString = "";
  for (const [key, value] of urlParams.entries()) {
    dataCheckString += `${key}=${value}\n`;
  }
  dataCheckString = dataCheckString.slice(0, -1);

  const secret = crypto
    .createHmac("sha256", "WebAppData")
    .update(process.env.TG_KEY);
  const calculatedHash = crypto
    .createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash === hash) {
    return { username, id };
  } else {
    return false;
  }
};

module.exports = verifyInitData;
