const db = require("../db");

const getUserDB = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    console.log("no user");
    return false;
  }
  const userData = await userDoc.data();
  return userData;
};

const getUserImproves = async (userId) => {
  const userImprovesRef = db
    .collection("users")
    .doc(userId)
    .collection("improvements");
  const userImprovesDoc = await userImprovesRef.get();
  let userImproves = [];

  if (!userImprovesDoc.exists) {
    userImproves = [];
  }

  userImprovesDoc.forEach((doc) => {
    userImproves.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return userImproves;
};

const getImprovementById = async (improvementId) => {
  const buildingRef = db.collection("improvements").doc(improvementId);
  const buildingDoc = await buildingRef.get();
  if (!buildingDoc.exists) {
    return false;
  }
  const building = buildingDoc.data();
  return building;
};

const purchaseImprovement = async (userId, improvementId) => {
  // Получение задачи по ID
  const userData = await getUserDB(userId);
  const improvement = await getImprovementById(improvementId);
  if (!improvement) {
    return { bool: false, text: "no such improvement" };
  }
  const firstLvlImprovement = improvement.lvls[0];

  // Ссылка на документ задачи пользователя
  const userImprovementRef = db
    .collection("users")
    .doc(userId)
    .collection("improvements")
    .doc(improvementId);

  // Получение задач пользователя
  const userImprovements = await getUserImproves(userId);

  // Проверка, если задача уже существует в списке задач пользователя
  const improvementExists = userImprovements.some(
    (userImprovement) => userImprovement.id === improvementId
  );

  if (improvementExists) {
    return {
      bool: false,
      text: "you have already purchased this improvement, it is better to update it",
    };
  }
  if (firstLvlImprovement.cost <= userData.money) {
    // Обновление задачи, помечая её как завершенную
    await userImprovementRef.set({
      ...firstLvlImprovement,
      desc: improvement.desc,
      name: improvement.name,
    });
    return { bool: true };
  } else {
    return { bool: false, text: "Not enough money" };
  }
};

const updateImprovement = async (userId, improvementId) => {
  // Получение задачи по ID
  const userData = await getUserDB(userId);
  const improvement = await getImprovementById(improvementId);
  if (!improvement) {
    return { bool: false, text: "No such improvement" };
  }

  // Ссылка на документ задачи пользователя
  const userImprovementRef = db
    .collection("users")
    .doc(userId)
    .collection("improvements")
    .doc(improvementId);

  const userCollectionImprovementDoc = await userImprovementRef.get();
  const userCollectionImprovementData = userCollectionImprovementDoc.data();

  const lvls = improvement.lvls;

  const currentLvlImprovement = userCollectionImprovementData.lvl;
  console.log(lvls);

  const nextLvl = lvls.find((lvl) => lvl.lvl == currentLvlImprovement + 1);

  if (!nextLvl) {
    return { bool: false, text: "There are no more lvls" };
  }

  if (nextLvl.cost <= userData.money) {
    // Обновление задачи, помечая её как завершенную
    await userImprovementRef.update({
      lvl: nextLvl.lvl,
      cost: nextLvl.cost,
      income: nextLvl.income,
    });
    return { bool: true, text: "You updated successfully!" };
  } else {
    return { bool: false, text: "Not enough money" };
  }
};

module.exports = {
  purchaseImprovement,
  updateImprovement,
  getUserImproves,
};
