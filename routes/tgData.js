const express = require("express");
const router = express.Router();
const UserService = require("../mongo/services/userService");
const userModel = require("../mongo/models/userModel");
const verifyInitData = require("../auth/auth");

router.post("/", async (req, res, next) => {
  console.log(true);

  try {
    const telegramData = req.body;
    console.log(telegramData);

    const authHeader = JSON.stringify(req.headers["authorization"]);
    console.log(`header is ${authHeader}`);

    const { username, id } = verifyInitData(authHeader);
    console.log(`why undefined ${id}`);

    const user = await userModel.findOne({ telegramId: id });
    console.log(user);

    if (!user || user == null) {
      await UserService.create({
        username: username,
        telegramId: id,
      });
    }

    req.session.tgId = id;

    return res.redirect("/");
  } catch (error) {
    console.log(error);

    return res.send(error);
  }
});

module.exports = router;
