const express = require("express");
const { Bot } = require("grammy");
const axios = require("axios");

const bot = new Bot(process.env.TG_KEY);

const router = express.Router();

router.post("/vip/:count", async (req, res) => {
  const count = req.params["count"];
  const title = "VAMP";
  const description = "Support us and we will support you";
  const payload = "{}";
  const currency = "XTR";
  const prices = [{ amount: count, label: "Vamp" }];

  const link = await bot.api.createInvoiceLink(
    title,
    description,
    payload,
    "", // Provider token must be empty for Telegram Stars
    currency,
    prices
  );
  console.log(link);

  res.json({ link });
});

router.post("/vipSuccess/:count", async (req, res) => {
  const count = req.params["count"];
});

router.post("/payment/webhook", async (req, res) => {
  const update = req.body; // JSON с данными от Telegram

  // Обработка pre_checkout_query
  if (update.pre_checkout_query) {
    await axios.post(
      `https://api.telegram.org/bot${process.env.TG_KEY}/answerPreCheckoutQuery`,
      {
        pre_checkout_query_id: update.pre_checkout_query.id,
        ok: true,
      }
    );
  }

  // Обработка успешного платежа
  if (update.message && update.message.successful_payment) {
    const payment = update.message.successful_payment;
    console.log("✅ Платёж успешен:", payment);
  }

  res.sendStatus(200); // Telegram ожидает ответ 200 OK
});

module.exports = router;
