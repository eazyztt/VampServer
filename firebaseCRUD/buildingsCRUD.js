const db = require("../db");

async function purchaseBuilding(userId, buildingName) {
  try {
    const userRef = db.collection("users").doc(userId);
    const buildingRef = db.collection("buildings").doc(buildingName);

    const userDoc = await userRef.get();
    const buildingDoc = await buildingRef.get();

    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    if (!buildingDoc.exists) {
      throw new Error(`Building with name ${buildingName} not found`);
    }

    const userData = userDoc.data();
    const buildingData = buildingDoc.data();

    console.log(buildingData.lvls);

    if (userData.money < buildingData.cost) {
      throw new Error(
        `User with ID ${userId} does not have enough money to purchase the building ${buildingName}`
      );
    }

    // Deduct the cost of the building from the user's money
    const firstLvl = buildingData.lvls[0];
    const newMoney = userData.money - firstLvl.cost;

    // Add the building to the user's buildings array
    const userBuildings = userData.buildings || [];
    userBuildings.push({
      name: buildingData.name,
      lvl: firstLvl.lvl,
      cost: firstLvl.cost,
      income: firstLvl.income,
      desc: buildingData.desc,
    });

    console.log(userBuildings);

    // Update the user's document in Firestore
    await userRef.update({
      money: newMoney,
      buildings: userBuildings,
    });

    console.log(
      `Building ${buildingName} purchased successfully for user ${userId}`
    );
  } catch (error) {
    console.error("Error purchasing building:", error);
  }
}

async function getAllBuildings() {
  try {
    const buildingsSnapshot = await db.collection("buildings").get();
    const buildings = [];

    buildingsSnapshot.forEach((doc) => {
      buildings.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return buildings;
  } catch (error) {
    console.error("Error getting buildings:", error);
    throw new Error("Unable to retrieve buildings");
  }
}

async function getUserBuildings(userId) {
  try {
    const user = await db.collection("users").doc(userId).get();
    const userData = user.data();
    const buildings = [];
    console.log(userData);
    if (userData.buildings) {
      userData.buildings.forEach((doc) => {
        buildings.push({
          ...doc,
        });
      });
    }
    return buildings;
  } catch (error) {
    console.error("Error getting buildings:", error);
    throw new Error("Unable to retrieve buildings");
  }
}

async function updateBuilding(userId, buildingName) {
  try {
    const userRef = db.collection("users").doc(userId);
    const buildingRef = db.collection("buildings").doc(buildingName);

    const userDoc = await userRef.get();
    const buildingDoc = await buildingRef.get();

    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    if (!buildingDoc.exists) {
      throw new Error(`Building with name ${buildingName} not found`);
    }

    const userData = userDoc.data();
    const buildingData = buildingDoc.data();

    let lvls = buildingData.lvls;

    let targetUserBuildings = userData.buildings.filter(
      (el) => el.name == buildingName
    );

    let targetUserBuilding = targetUserBuildings[0];

    let targetUserBuildingIndex =
      userData.buildings.indexOf(targetUserBuilding);

    if (userData.money < targetUserBuilding.cost) {
      throw new Error(
        `User with ID ${userId} does not have enough money to update the building ${buildingName}`
      );
    }

    let targetLvl = lvls.filter(
      (el) => el.lvl == targetUserBuilding.lvl + 1
    )[0];

    console.log(targetLvl);

    // Deduct the cost of the building from the user's money
    const newMoney = userData.money - targetUserBuilding.cost;

    // Add the building to the user's buildings array
    const userBuildings = userData.buildings || [];

    userBuildings[targetUserBuildingIndex] = {
      name: buildingData.name,
      lvl: targetLvl.lvl,
      cost: targetLvl.cost,
      income: targetLvl.income,
      desc: buildingData.desc,
    };

    console.log(userBuildings);

    // Update the user's document in Firestore
    await userRef.update({
      money: newMoney,
      buildings: userBuildings,
    });

    console.log(
      `Building ${buildingName} purchased successfully for user ${userId}`
    );
  } catch (error) {
    console.error("Error purchasing building:", error);
  }
}

module.exports = {
  purchaseBuilding,
  getAllBuildings,
  getUserBuildings,
  updateBuilding,
};
