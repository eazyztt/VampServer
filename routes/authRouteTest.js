const express = require("express");
const router = express.Router();
const UserService = require("../mongo/services/userService");
const userModel = require("../mongo/models/userModel");
const verifyInitData = require("../auth/auth");

router.get("/", async (req, res) => {
  const userId = req.session.id;
  try {
    const user = await UserService.getUserInfo(userId);
    return res.send(user);
  } catch (error) {
    return res.send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const telegramData = req.body;
    const { username, id } = verifyInitData(telegramData.initData);
    const user = await userModel.findById(id);
    if (!user) {
      UserService.create({
        name: username,
        telegramId: id,
      });
      req.session.id = id;
    }
    req.session.id = id;
    return res.send("success");
  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;
