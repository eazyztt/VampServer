const express = require("express");
const router = express.Router();
const UserService = require("../psqlServices/user");
const cryptoId = require("../utilities/cryptoId");
const VampStatus = require("../psqlServices/tamagochi");

router.post("/", async (req, res) => {
  try {
    const user = await VampStatus.updateStatus("6571245334");

    if (!user || user == null) {
      await UserService.create({
        username: req.username,
        telegramId: req.tgId,
        money: 1000,
        readyToClaim: true,
      });
    }

    return res.json(user);
  } catch (err) {
    console.log(err);
    return;
  }
});

module.exports = router;
