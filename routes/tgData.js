const express = require("express");
const router = express.Router();
const UserService = require("../psqlServices/user");
const cryptoId = require("../utilities/cryptoId");
const VampStatus = require("../psqlServices/tamagochi");

router.post("/", async (req, res, next) => {
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

    return res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
