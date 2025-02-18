const axios = require("axios");

async function setWebhook() {
  const BOT_TOKEN = process.env.TG_KEY;
  const WEBHOOK_URL = process.env.WEBHOOK_URL;

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
      {
        url: WEBHOOK_URL,
      }
    );
    console.log("Webhook установился:", response.data);
  } catch (error) {
    console.error(
      "Ошибка установки Webhook:",
      error.response?.data || error.message
    );
  }
}

setWebhook();
