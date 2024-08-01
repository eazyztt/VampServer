const db = require("../db");

async function updateMoneyAfterClaim(userId) {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();
  const moneyForClaim = userData.moneyForClaim;
  const lastClaim = userData.lastClaim;
  const currentTime = Date.now();
  console.log({ lastClaim, currentTime });
  let diffInTime = (currentTime - lastClaim) / 1000 / 60 / 60;
  console.log(diffInTime);
  //const y = new Date("2013-05-23");
  if ((currentTime - lastClaim) / 1000 / 60 / 60 >= 1 / 60) {
    const money = userData.money + moneyForClaim;
    userRef.update({
      readyToClaim: false,
      money: money,
      lastClaim: Date.now(),
    });
    return { userData };
  } else {
    return false;
  }
}

async function updateUserLvl(userId) {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();
  const tasksRef = await db
    .collection("tasks")
    .where("lvl", "==", userData.lvl)
    .get();

  let allTasksForUserLvl = [];

  tasksRef.forEach((doc) => {
    allTasksForUserLvl.push(doc);
  });

  const userTasksRef = await userRef
    .collection("tasks")
    .where("lvl", "==", userData.lvl)
    .get();
  if (!userTasksRef.exists) {
    return false;
  }
  let userTasks = [];
  userTasksRef.forEach((doc) => {
    userTasks.push(doc);
  });
  if (allTasksForUserLvl.length === userTasks.length) {
    userRef.update({
      lvl: (userData.lvl += 1),
    });
    return true;
  } else {
    return false;
  }
}

module.exports = {
  updateMoneyAfterClaim,
  updateUserLvl,
};
