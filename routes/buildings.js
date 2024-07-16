const express = require("express");
const router = express.Router();
const buildingsLogic = require("../buildingsCRUD");

router.post("/buildings/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const userId = req.session.userId;
  console.log(userId);
  try {
    await buildingsLogic.purchaseBuilding(userId, id);
    res.send("super");
  } catch (error) {
    console.log(error);
  }
});

router.get("/userBuildings", async (req, res) => {
  const buildings = await buildingsLogic.getUserBuildings(req.session.userId);
  res.render("pages/userBuildings", { buildings });
});

router.post("/updateBuilding/:name", async (req, res) => {
  const name = req.params.name;
  console.log(name);
  const userId = req.session.userId;
  console.log(userId);
  console.log("woooooooooork");
  try {
    await buildingsLogic.updateBuilding(userId, name);
    res.send("super");
  } catch (error) {
    console.log(error);
  }
});

router.get("/buildings", async (req, res) => {
  let buildings = await buildingsLogic.getAllBuildings();
  if (buildings) {
    res.render("pages/allBuildings", { buildings });
  } else {
    res.send("no buildings in fb");
  }
});

module.exports = router;
