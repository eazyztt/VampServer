const express = require("express");
const router = express.Router();
const FriendService = require("../mongo/services/friendsService");

router.get("/", async (req, res) => {
  const authHeader = JSON.stringify(req.headers["authorization"]);
  console.log(`header is ${authHeader}`);

  const { username, id } = verifyInitData(authHeader);
  try {
    const friends = await FriendService.getFriends(id);
    return res.status(200).json(friends);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
