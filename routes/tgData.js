const express = require("express");
const router = express.Router();
const UserService = require("../psqlServices/user");
const cryptoId = require("../utilities/cryptoId");
const VampStatus = require("../psqlServices/tamagochi");

router.post("/", async (req, res, next) => {
  const user = await VampStatus.updateStatus(req.tgId);
  const hash = cryptoId.encrypt(req.tgId, process.env.SECRET_KEY_ID);

  if (!user || user == null) {
    await UserService.create({
      username: req.username,
      telegramId: req.tgId,
      money: 1000,
      readyToClaim: true,
      skin: "girl",
      lastClaim: 1020905, // birthday
      hash: hash,
      lvl: 1,
    });
  }

  return res.redirect("/");
});

module.exports = router;
