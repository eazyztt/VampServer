const express = require("express");
const router = express.Router();
const friendsCRUD = require("../firebaseCRUD/friendsCRUD");

router.get("/", async (req, res) => {
  const friends = await friendsCRUD.getFriends(process.env.ID);
  res.send({ friends });
});

router.post("/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    let uniqeUser = await friendsCRUD.inviteFriend(process.env.ID, id);
    console.log(uniqeUser);
    if (uniqeUser) {
      return res.send("new user is invited");
    } else {
      return res.send("no such user or user is already registered");
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
