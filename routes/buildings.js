const express = require("express");
const router = express.Router();
const buildingsLogic = require("../firebaseCRUD/buildingsCRUD");

router.post("/buildings/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  let userId = req.body.userIdName.id;

  try {
    await buildingsLogic.purchaseBuilding(userId, id);
    res.send("super");
  } catch (error) {
    console.log(error);
  }
});

router.get("/userBuildings", async (req, res) => {
  console.log(req.body);
  let id = req.body.userIdName.id;
  const buildings = await buildingsLogic.getUserBuildings(id);
  res.render("pages/userBuildings", { buildings });
});

router.post("/updateBuilding/:name", async (req, res) => {
  const name = req.params.name;
  console.log(name);
  let id = req.body.userIdName.id;
  console.log("woooooooooork");
  try {
    await buildingsLogic.updateBuilding(id, name);
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
