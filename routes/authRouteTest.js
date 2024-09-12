const express = require("express");
const router = express.Router();
const UserService = require("../mongo/services/userService");

router.post("/", async (req, res) => {
  try {
    const telegramData = req.body;
    const { username, id } = verifyInitData(telegramData.initData);
    UserService.create({
      name: username,
      telegramId: id,
    });
    return res.send("success");
  } catch (error) {
    return res.send(error);
  }
});

module.exports = router;
