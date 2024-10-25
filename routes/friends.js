const express = require("express");
const router = express.Router();
const FriendService = require("../mongo/services/friendsService");

router.get("/", async (req, res) => {
  try {
    const friends = await FriendService.getFriends(req.tgId);
    return res.status(200).json(friends);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
