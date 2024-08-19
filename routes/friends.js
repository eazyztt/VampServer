const express = require("express");
const router = express.Router();
const friendsCRUD = require("../firebaseCRUD/friendsCRUD");

router.get("/", async (req, res) => {
  const userId = process.env.ID;
  const friends = await friendsCRUD.getFriends(userId);
  res.send({ friends });
});

router.post("/invite/:id", async (req, res) => {
  const userId = req.params.id;
  const invitedUserId = process.env.ID;
  await friends2CRUD.addFriend(invitedUserId, userId);
  res.send("success");
});

module.exports = router;
