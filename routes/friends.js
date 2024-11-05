const express = require("express");
const router = express.Router();
const FriendService = require("../psqlServices/friend");
const UserService = require("../psqlServices/user");

router.get("/", async (req, res) => {
  try {
    const friends = await FriendService.getFriendsFunc(req.tgId);
    return res.status(200).json(friends);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.post("/claim", async (req, res) => {
  try {
    await UserService.claimMoneyFromInvites(req.tgId);
    return res.send("Claimed!");
  } catch (e) {
    return res.send(e.message);
  }
});

module.exports = router;
