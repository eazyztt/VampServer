const express = require("express");
const router = express.Router();
const UserService = require("../mongo/services/userService");
const userModel = require("../mongo/models/userModel");
const verifyInitData = require("../auth/auth");

router.post("/", async (req, res) => {
  try {
    const telegramData = req.body;
    console.log(telegramData);

    const { username, id } = verifyInitData(telegramData.initData);
    console.log(id);

    const user = await userModel.findOne({ telegramId: id });
    console.log(user);

    if (!user || user == null) {
      await UserService.create({
        username: username,
        telegramId: id,
      });
    }
    req.session.tgId = id;
    console.log(`${req.session.tgId} session id`);

    return res.send("ok");
  } catch (error) {
    console.log(error);

    return res.send(error);
  }
});

module.exports = router;
