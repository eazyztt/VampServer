const express = require("express");
const VampStatus = require("../psqlServices/tamagochi");

const router = express.Router();

router.post("/wash", async (req, res) => {
  try {
    await VampStatus.wash(req.tgId);
    res.send({ wash: "yes" });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.post("/feed", async (req, res) => {
  try {
    const user = await VampStatus.feed(req.tgId);
    res.send(user);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.post("/rock", async (req, res) => {
  try {
    const user = await VampStatus.rock(req.tgId);
    res.send(user);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.post("/sleep", async (req, res) => {
  try {
    const user = await VampStatus.sleep(req.tgId);
    res.send(user);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
