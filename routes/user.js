const express = require("express");
const router = express.Router();
const userService = require("../mongo/services/userService");
const verifyInitData = require("../auth/auth");

router.get("/", async (req, res) => {
  const telegramData = req.cookies.telegramData;

  const { username, id } = verifyInitData(telegramData.initData);

  console.log(`id of user is ${id}`);

  console.log("hello");

  try {
    const user = await userService.getUserInfo(id);
    console.log(`user sended to client ${user}`);

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);

    return res.status(400).send(err.message);
  }
});

router.get("/hash", async (req, res) => {
  const userId = req.session.id;
  try {
    const hash = await userService.getHash(userId);
    return res.send(hash);
  } catch (err) {
    return res.send(err);
  }
});

router.post("/claim", async (req, res) => {
  const id = req.session.id;
  const user = await userService.claimMoney(id);
  if (user) {
    return res.send(user);
  }

  return res.send("too early to claim money");
});

router.post("/updateLvl", async (req, res) => {
  const id = req.session.id;
  try {
    const userLvlUpdate = await userService.updateUserLvl(id);
    return res.send(userLvlUpdate);
  } catch (err) {
    return res.send(err);
  }
});

module.exports = router;
