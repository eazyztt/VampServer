const express = require("express");
const router = express.Router();
const userCRUD = require("../firebaseCRUD/userCRUD");

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

router.get("/hash", async (req, res) => {
  const id = req.session.userId;
  const user = await userCRUD.getUserDB(id);
  if (!user) {
    return res.send("error");
  }
  return res.send(`localhost:3001//user/${user.hash}`);
});

module.exports = router;
