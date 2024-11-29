const express = require("express");
const handCall = require("../psqlServices/handCall");

const router = express.Router();

router.post("/leaderboard", async (req, res) => {
  try {
    await handCall.updateLeaderboard();
    return res.send("leaderboard updated");
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
