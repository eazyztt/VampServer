const express = require("express");
const { Bot } = require("grammy");
const axios = require("axios");
const Payment = require("../psqlModels/payment");
const User = require("../psqlModels/user");
const premiumService = require("../psqlServices/premium");
const { pre } = require("telegraf/format");

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

router.post("/vipSuccess/res/:count", async (req, res) => {
  const count = req.params["count"];
  if (count == 99) {
    await premiumService.addPremium(3, req.tgId);
  } else if (count == 333) {
    await premiumService.addPremium(9, req.tgId);
  } else if (count == 999) {
    await premiumService.addPremium(33, req.tgId);
  }
  res.send({ count: count });
});

router.post("/payment/webhook", async (req, res) => {
  const update = req.body;
  //console.log("📩 Получено обновление от Telegram:", update);

  if (update.pre_checkout_query) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${process.env.TG_KEY}/answerPreCheckoutQuery`,
        { pre_checkout_query_id: update.pre_checkout_query.id, ok: true }
      );
      //console.log("✅ Pre-checkout подтверждён.");
    } catch (error) {
      console.error("❌ Ошибка pre_checkout:", error);
      return res.sendStatus(500);
    }
  }

  if (update.message && update.message.successful_payment) {
    const payment = update.message.successful_payment;
    //console.log("✅ Платёж успешен:", payment);
    try {
      await Payment.create({
        total_amount: payment.total_amount,
        telegram_payment_charge_id: payment.telegram_payment_charge_id,
        userId: update.message.from.id,
      });
    } catch (e) {
      console.log(`Payment error🤨🤨 ${e}`);
    }
    // Тут логика, что делать после успешной оплаты
  }

  res.sendStatus(200); // Telegram ожидает 200 OK
});

router.post("/vip/res/:count", async (req, res) => {
  const count = req.params["count"];
  console.log(`deathTimes is here ${count}`);

  const title = "VAMP";
  const description = "Support us and we will resurrect you";
  const payload = "{}";
  const currency = "XTR";
  const prices = [{ amount: 111, label: "Vamp Res" }];

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

router.post("/vipSuccess/res", async (req, res) => {
  console.log("endpoint for res vipsuccess is working fine");

  await premiumService.resurrect(req.tgId);
  res.send({ success: true });
});

module.exports = router;
