const express = require("express");
const router = express.Router();
const FriendService = require("../mongo/services/friendsService");

router.get("/", async (req, res) => {
  const userId = process.env.ID;
  try {
    const friends = await FriendService.getFriends(userId);
    return res.status(200).json(friends);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
