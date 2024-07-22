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

module.exports = router;
