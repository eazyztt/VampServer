const express = require("express");
const router = express.Router();
const userService = require("../mongo/services/userService");

router.get("/", async (req, res) => {
  const userId = process.env.ID;
  try {
    const user = await userService.getUserInfo(userId);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.get("/hash", async (req, res) => {
  const userId = process.env.ID;
  let userDocRef = db.collection("users").doc(userId);
  let userDoc = await userDocRef.get();
  if (userDoc.exists) {
    return res.send({ hash: userDoc.data().hash });
  } else {
    return res.status(400).send("no user in DB");
  }
});

router.post("/claim", async (req, res) => {
  const id = process.env.ID;
  let resultBool = await userCRUD.updateMoneyAfterClaim(id);
  if (resultBool) {
    res.send({ resultBool });
  } else {
    res.send("not ready to claim");
  }
});

router.post("/updateLvl", async (req, res) => {
  const id = process.env.ID;
  let updatedLvl = await userCRUD.updateUserLvl(id);
  if (updatedLvl) {
    return res.send("ok");
  } else {
    return res.send("You need to complete all tasks");
  }
});

module.exports = router;
