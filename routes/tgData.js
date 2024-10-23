const express = require("express");
const router = express.Router();
const UserService = require("../psql/userService");
const userModel = require("../mongo/models/userModel");
const verifyInitData = require("../auth/auth");
const cryptoId = require("../../utilities/cryptoId");

router.post("/", async (req, res, next) => {
  const user = await UserService.getUserInfo(req.tgId);
  const hash = cryptoId.encrypt(req.tgId, process.env.SECRET_KEY_ID);

  if (!user || user == null) {
    await UserService.create({
      username: req.username,
      telegramId: req.tgId,
      money: 1000,
      readyToClaim: true,
      skin: "girl",
      lastClaim: Date(), // birthday
      hash: hash,
      lvl: 1,
    });
  }

  return res.redirect("/");
});

module.exports = router;
