const express = require("express");
const router = express.Router();
const userService = require("../psqlServices/user");
const cryptoId = require("../utilities/cryptoId");
const verifyInitData = require("../auth/auth");
const VampStatus = require("../psqlServices/tamagochi");
const UserService = require("../psqlServices/user");
const FriendService = require("../psqlServices/friend");

router.post("/sex", async (req, res) => {
  const { sex } = req.body;
  console.log(sex);

  try {
    const user = await UserService.chooseSex(req.tgId, sex);
    res.send(user);
  } catch (e) {
    return res.send(e);
  }
});

router.get("/start", async (req, res) => {
  // поменять ссылку!
  const id = req.query.startApp;
  const user = await VampStatus.updateStatus(req.tgId);
  console.log(`this is ouuuuuur ${id}`);

  if (!user) {
    await UserService.create({
      username: req.username,
      telegramId: req.tgId,
      money: 1000,
      readyToClaim: true,
    });
    if (id && typeof id !== "undefined") {
      const userFriend = await FriendService.addUniqueFriend(id, req.tgId);
      if (!userFriend) {
        return res.send("error");
      }
      const userForClient = {
        username: userFriend.username,
        money: userFriend.money,
        lvl: userFriend.lvl,
        isHungry: userFriend.isHungry,
        isTired: userFriend.isTired,
        isDirty: userFriend.isDirty,
        isDead: userFriend.isDead,
        isBored: userFriend.isBored,
        sex: userFriend.sex,
      };
      return res.send(userForClient);
    }
    return res.send(user);
  }

  //res.redirect("/");
  return res.send(user);
});

router.get("/ref", async (req, res) => {
  const hash = `t.me/vamp_pump_bot/vamp_app/?startApp=${req.tgId}`;
  return res.json({ hash: hash });
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
  const id = req.tgId;
  try {
    const userLvlUpdate = await userService.updateUserLevel(id);
    return res.send(userLvlUpdate);
  } catch (e) {
    return res.send(e);
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const users = await userService.leaderboard();
    return res.send(users);
  } catch (e) {
    return res.send(e);
  }
});

router.post("/updateLvl", async (req, res) => {
  try {
    const user = await userService.updateUserLevel(req.tgId);
    res.send(user);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
