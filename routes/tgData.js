const express = require("express");
const router = express.Router();
const UserService = require("../mongo/services/userService");
const userModel = require("../mongo/models/userModel");
const verifyInitData = require("../auth/auth");

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
