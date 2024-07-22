const express = require("express");
const router = express.Router();
const buildingsLogic = require("../firebaseCRUD/buildingsCRUD");

router.post("/buildings/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const userId = process.env.ID;
  console.log(userId);
  try {
    let purchasedBuilding = await buildingsLogic.purchaseBuilding(userId, id);
    res.send({ purchasedBuilding });
  } catch (error) {
    console.log(error);
  }
});

router.get("/userBuildings", async (req, res) => {
  const buildings = await buildingsLogic.getUserBuildings(process.env.ID);
  res.send({ buildings });
});

router.post("/updateBuilding/:name", async (req, res) => {
  const name = req.params.name;
  console.log(name);
  const userId = process.env.ID;
  console.log(userId);
  console.log("woooooooooork");
  try {
    let updatedBulding = await buildingsLogic.updateBuilding(userId, name);
    res.send({ updatedBulding });
  } catch (error) {
    console.log(error);
  }
});

router.get("/buildings", async (req, res) => {
  let buildings = await buildingsLogic.getAllBuildings();
  if (buildings) {
    res.send({ buildings });
  } else {
    res.send("no buildings in fb");
  }
});

module.exports = router;
