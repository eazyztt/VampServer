const express = require("express");
const VampStatus = require("../psqlServices/tamagochi");

const router = express.Router();

router.post("/wash", async (req, res) => {
  try {
    await VampStatus.wash(req.tgId);
    res.send("Washed!");
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.post("/feed", async (req, res) => {
  try {
    await VampStatus.feed(req.tgId);
    res.send("Feed!");
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.post("/sleep", async (req, res) => {
  try {
    await VampStatus.sleep(req.tgId);
    res.send("Slept!");
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
