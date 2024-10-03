const express = require("express");
const router = express.Router();
const improveService = require("../mongo/services/improveService");

router.get("/", async (req, res) => {
  const allImprovements = await improveService.getAll();
  res.status(200).json(allImprovements);
});

router.get("/userImproves", async (req, res) => {
  const userId = req.session.id;
  const allUserImproves = await improveService.getUserImprovements(userId);
  res.status(200).json(allUserImproves);
});

router.post("/purchase/:id", async (req, res) => {
  const userId = req.session.id;
  const improvementId = req.params.id;
  try {
    const purchaseImprovement = await improveService.purchaseImprovement(
      userId,
      improvementId
    );
    res.send(purchaseImprovement);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/update/:id", async (req, res) => {
  const userId = req.session.id;
  const improvementId = req.params.id;
  try {
    const updateImprovement = await improveService.updateImprovement(
      userId,
      improvementId
    );
    return res.status(200).send(updateImprovement);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
