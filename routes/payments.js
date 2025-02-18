const express = require("express");
const { Bot } = require("grammy");
const axios = require("axios");
const Payment = require("../psqlModels/payment");

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

  res.send({ link: link });
});

router.post("/vipSuccess/:count", async (req, res) => {
  const count = req.params["count"];
  res.send({ count: count });
});

router.post("/payment/webhook", async (req, res) => {
  const update = req.body;
  console.log("📩 Получено обновление от Telegram:", update);

  if (update.pre_checkout_query) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${process.env.TG_KEY}/answerPreCheckoutQuery`,
        { pre_checkout_query_id: update.pre_checkout_query.id, ok: true }
      );
      console.log("✅ Pre-checkout подтверждён.");
    } catch (error) {
      console.error("❌ Ошибка pre_checkout:", error);
      return res.sendStatus(500);
    }
  }

  if (update.message && update.message.successful_payment) {
    const payment = update.message.successful_payment;
    console.log("✅ Платёж успешен:", payment);
    await Payment.create({
      total_amount: payment.total_amount,
      telegram_payment_charge_id: payment.telegram_payment_charge_id,
      userId: update.message.from.id,
    });
    // Тут логика, что делать после успешной оплаты
  }

  res.sendStatus(200); // Telegram ожидает 200 OK
});

module.exports = router;
