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

const getUserRefAndDoc = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    console.log("no user");
    return false;
  }
  return { userRef, userDoc };
};

const checkIfUserAlreadyInDB = async (userId, newUserId) => {
  const userDB = await getUserRefAndDoc(userId);
  const newUserDB = await getUserRefAndDoc(newUserId);
  const userData = userDB.userDoc.data();
  const newUserData = newUserDB.userDoc.data();
  const userFriends = userData.friends;
  if (userFriends.includes(newUserData.id)) {
    return false;
  }
  return true;
};

const updateUserDoc = async (userId, data) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    return false;
  }
  userRef.update(data);
};

const setUserDoc = async (userId, data) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  if (userDoc.exists) {
    return false;
  }
  await userRef.set({
    ...data,
  });
  return true;
};

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

  let userTasks = [];
  userTasksRef.forEach((doc) => {
    userTasks.push(doc);
  });

  console.log(allTasksForUserLvl.length, userTasks.length);
  if ((allTasksForUserLvl.length == 0, userTasks.length == 0)) {
    return false;
  }
  if (allTasksForUserLvl.length === userTasks.length) {
    await userRef.update({
      lvl: (userData.lvl += 1),
    });
    allTasksForUserLvl = [];
    userTasks = [];
    return true;
  } else {
    return false;
  }
}

module.exports = {
  updateMoneyAfterClaim,
  updateUserLvl,
  getUserDB,
  updateUserDoc,
  setUserDoc,
  checkIfUserAlreadyInDB,
};
