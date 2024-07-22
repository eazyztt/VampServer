const express = require("express");
const router = express.Router();
const friendsCRUD = require("../firebaseCRUD/friendsCRUD");

router.get("/", async (req, res) => {
  const friends = await friendsCRUD.getFriends(process.env.ID);
  res.send({ friends });
});

router.post("/:id", async (req, res) => {
  const id = req.params.id;
  let uniqeUser = await friendsCRUD.inviteFriend(process.env.ID, id);
  if (uniqeUser) {
    return res.send("new user is invited");
  } else {
    return res.send("user is already registered");
  }
});

module.exports = router;
