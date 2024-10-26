const express = require("express");
const router = express.Router();
const userService = require("../psqlServices/user");
const cryptoId = require("../utilities/cryptoId");
const verifyInitData = require("../auth/auth");
const VampStatus = require("../psqlServices/tamagochi");
const UserService = require("../psqlServices/user");
const FriendService = require("../psqlServices/friend");

router.get("/", async (req, res) => {
  //const { username, id } = verifyInitData(telegramData);

  try {
    const user = await userService.getUserInfo(req.tgId);
    console.log(`user sended to client ${user}`);

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);

    return res.status(400).send(err.message);
  }
});

router.get("/hash/:hash", async (req, res) => {
  const hash = req.params.hash;
  const decrypt = cryptoId.decrypt(hash, process.env.SECRET_KEY_ID);
  const newUserHash = cryptoId.encrypt(decrypt, process.env.SECRET_KEY_ID);

  const user = await VampStatus.updateStatus(req.tgId);

  if (!user || user == null) {
    await UserService.create({
      username: req.username,
      telegramId: req.tgId,
      money: 1000,
      readyToClaim: true,
      hash: newUserHash,
    });
    FriendService.addUniqueFriend(decrypt, req.tgId);
  }
  res.redirect("/");
});

router.get("/user/hash", async (req, res) => {
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
