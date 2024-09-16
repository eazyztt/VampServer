const express = require("express");
const cryptoId = require("../utilities/cryptoId");
const db = require("../db");
const mainAuthFunc = require("../utilities/mainAuthFunc");

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.session.userId;
  let userDocRef = db.collection("users").doc(userId);
  let userDoc = await userDocRef.get();
  if (userDoc.exists) {
    return res.send(userDoc.data());
  } else {
    return res.status(400).send("error");
  }
});

router.post("/telegram-data", async (req, res) => {
  const telegramData = req.body;
  const newUserId = await mainAuthFunc(telegramData.initData);
  if (newUserId) {
    req.session.userId = newUserId;
  }
  let userDocRef = db.collection("users").doc(newUserId);
  let userDoc = await userDocRef.get();
  if (userDoc.exists) {
    const hash = cryptoId.encrypt(newUserId, process.env.SECRET_KEY_ID);
    await cryptoId.hashToDB(newUserId, hash);
    return res.send("auth is done");
  } else {
    return res.status(400).send("error");
  }
});

router.post("/:userHashURL", async (req, res) => {
  const hash = req.params.userHashURL;
  if (!hash) {
    return res.send("no user in DB?");
  }
  const userId = cryptoId.decrypt(hash, process.env.SECRET_KEY_ID);
  const telegramData = req.body;
  const newUserId = await mainAuthFunc(telegramData.initData);
  if (newUserId) {
    req.session.userId = newUserId;
    await friendsCRUD.inviteFriend(userId, newUserId);
    return res.send("auth is done");
  } else {
    return res.send("error");
  }
});

module.exports = router;
