const express = require("express");
const router = express.Router();
const userCRUD = require("../firebaseCRUD/userCRUD");

router.post("/claim/:id", async (req, res) => {
  const id = req.params.id;
  let resultBool = await userCRUD.updateMoneyAfterClaim(id);
  if (resultBool) {
    res.send({ resultBool });
  } else {
    res.send("not ready to claim");
  }
});

module.exports = router;
