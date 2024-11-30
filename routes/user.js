const express = require("express");
const router = express.Router();
const userService = require("../psqlServices/user");
const cryptoId = require("../utilities/cryptoId");
const verifyInitData = require("../auth/auth");
const VampStatus = require("../psqlServices/tamagochi");
const UserService = require("../psqlServices/user");
const FriendService = require("../psqlServices/friend");

router.get("/", async (req, res) => {
  const user = req.session.USER;
  console.log(user);

  if (!user) {
    return res.status(400).send("No user");
  }
  return res.status(200).json(user);
});

router.post("/sex", async (req, res) => {
  const sex = req.body.sex;
  try {
    await UserService.chooseSex(req.tgId, sex);
  } catch (e) {
    return res.send(e.message);
  }
});

router.get("/start", async (req, res) => {
  // поменять ссылку!
  const id = req.query.startapp;
  const user = await VampStatus.updateStatus(req.tgId);

  if (!user || user == null) {
    await UserService.create({
      username: req.username,
      telegramId: req.tgId,
      money: 1000,
      readyToClaim: true,
    });
    await FriendService.addUniqueFriend(id, req.tgId);
  }
  res.redirect("/");
});

router.get("/ref", async (req, res) => {
  const hash = `t.me/vamp_pump_bot/vamp_app/start?startapp=${req.tgId}`;
  return res.send(hash);
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

router.get("/leaderboard", async (req, res) => {
  try {
    const users = await userService.leaderboard();
    return res.send(users);
  } catch (err) {
    return res.send(err.message);
  }
});

module.exports = router;
