const express = require("express");
const router = express.Router();
const friends2CRUD = require("../firebaseCRUD/friends2CRUD");

router.get("/", async (req, res) => {
  const userId = process.env.ID;
  const friends = await friends2CRUD.getFriends(userId);
  res.send({ friends });
});

router.post("/invite/:id", async (req, res) => {
  const userId = req.params.id;
  const invitedUserId = process.env.ID;
  await friends2CRUD.addFriend(invitedUserId, userId);
  res.send("success");
});

module.exports = router;
