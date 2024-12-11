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
      lvl: "1",
      isHungry: user.isHungry,
      isTired: user.isTired,
      isDirty: user.isDirty,
      isDead: user.isDead,
      isBored: user.isBored,
      sex: user.sex,
      //place: user.place,
    };

    req.session.save((err) => {
      if (err) {
        console.error("Ошибка сохранения сессии:", err);
      }
    });

    return res.json(req.session.USER);
  } catch (err) {
    console.log(err);
    return;
  }
});

module.exports = router;
