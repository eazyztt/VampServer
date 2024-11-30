const express = require("express");
const router = express.Router();
const UserService = require("../psqlServices/user");
const cryptoId = require("../utilities/cryptoId");
const VampStatus = require("../psqlServices/tamagochi");

router.post("/", async (req, res) => {
  try {
    const user = await VampStatus.updateStatus(req.tgId);

    if (!user || user == null) {
      await UserService.create({
        username: req.username,
        telegramId: req.tgId,
        money: 1000,
        readyToClaim: true,
      });
    }

    req.session.USER = {
      username: user.username,
      money: user.money,
      lastClaim: user.lastClaim,
      lvl: user.lvl,
      isHungry: user.isHungry,
      isTired: user.isTired,
      isDirty: user.isDirty,
      isDead: user.isDead,
      isBored: user.isBored,
      //place: user.place,
    };

    return res.redirect("/");
  } catch (err) {
    console.log(err);
    return;
  }
});

module.exports = router;
