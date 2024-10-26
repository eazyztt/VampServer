const express = require("express");
const router = express.Router();
const UserService = require("../psqlServices/user");
const cryptoId = require("../utilities/cryptoId");
const VampStatus = require("../psqlServices/tamagochi");

router.post("/", async (req, res, next) => {
  try {
    const user = await VampStatus.updateStatus(req.tgId);

    const hash = cryptoId.encrypt(req.tgId, process.env.SECRET_KEY_ID);

    if (!user || user == null) {
      await UserService.create({
        username: req.username,
        telegramId: req.tgId,
        money: 1000,
        readyToClaim: true,
        hash: hash,
      });
    }

    return res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
