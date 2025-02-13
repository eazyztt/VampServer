const express = require("express");
const { Bot } = require("grammy");

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

module.exports = router;
