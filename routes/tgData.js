const express = require("express");
const router = express.Router();
const UserService = require("../mongo/services/userService");
const userModel = require("../mongo/models/userModel");
const verifyInitData = require("../auth/auth");

router.post("/", async (req, res, next) => {
  try {
    const user = await userModel.findOne({ telegramId: req.tgId });

    if (!user || user == null) {
      await UserService.create({
        username: req.username,
        telegramId: req.tgId,
      });
    }

    return res.redirect("/");
  } catch (error) {
    console.log(error);

    return res.send(error);
  }
});

module.exports = router;
