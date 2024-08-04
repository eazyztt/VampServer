const express = require("express");
const cryptoId = require("../utilities/cryptoId");
const db = require("../db");

const router = express.Router();

//функция которая создает макет юзера
const initUser = (id, username) => {
  const hash = cryptoId.encrypt(id, process.env.SECRET_KEY_ID);
  let lastClaim = Date.now();
  const hours = lastClaim.getHours();
  lastClaim.setHours(hours - 4);
  return {
    id: id,
    money: 1000,
    friends: [],
    lvl: 1,
    friendsInvited: 0,
    moneyForClaim: 100,
    readyToClaim: false,
    username: username,
    hash: hash,
    lastClaim: lastClaim,
  };
};

router.post("/telegram-data", async (req, res) => {
  //const telegramData = req.body;
  //console.log(telegramData.initData);
  //let { username, id } = verifyInitData(telegramData.initData);
  let { username, id } = { username: "smthabout_name", id: process.env.ID };
  if (username && id) {
    const userRef = db.collection("users").doc(id);
    let userDoc = await userRef.get();
    if (!userDoc.exists) {
      const newUser = initUser(id, username);
      await userRef.set(newUser);
      console.log("User data saved to Firestore");
    }
    console.log(username);
    req.session.tgUser = username;
    req.session.userId = id;
    res.redirect("/");
  } else {
    res.send("errorAuth");
  }
});

module.exports = router;
