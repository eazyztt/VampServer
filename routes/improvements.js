const express = require("express");
const improvementsCrud = require("../firebaseCRUD/improvementsCRUD");

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = process.env.ID;
  const improvements = await improvementsCrud.getUserImproves(userId);
  if (!improvements) {
    return res.send("error");
  }
  return res.send(improvements);
});

router.post("/purchase/:id", async (req, res) => {
  const userId = process.env.ID;
  const improvementId = req.params.id;
  const purchaseImprovement = await improvementsCrud.purchaseImprovement(
    userId,
    improvementId
  );
  if (!purchaseImprovement) {
    return res.send("error");
  }
  return res.send("purchased successfully");
});

router.post("/update/:id", async (req, res) => {
  const userId = process.env.ID;
  const improvementId = req.params.id;
  const updateImprovement = await improvementsCrud.updateImprovement(
    userId,
    improvementId
  );
  if (!updateImprovement) {
    return res.send("error");
  }
  return res.send("updated successfully");
});

module.exports = router;
