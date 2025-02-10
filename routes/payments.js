const express = require("express");
const { Bot } = require("grammy");

const bot = new Bot(process.env.TG_KEY);

const router = express.Router();

router.post("/generate-invoice", async (req, res) => {
  const title = "Test Product";
  const description = "Test description";
  const payload = "{}";
  const currency = "XTR";
  const prices = [{ amount: 1, label: "Test Product" }];

  const invoiceLink = await bot.api.createInvoiceLink(
    title,
    description,
    payload,
    "", // Provider token must be empty for Telegram Stars
    currency,
    prices
  );

  res.json({ invoiceLink });
});

module.exports = router;
