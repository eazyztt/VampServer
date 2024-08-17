const db = require("../db");

const wash = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    return { bool: false, text: "no such user in DB" };
  }
  await userRef.update({
    washed: { washed: true },
  });
};

const sleep = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    return { bool: false, text: "no such user in DB" };
  }
  await userRef.update({
    states: { sleeped: true },
  });
};

const feed = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    return { bool: false, text: "no such user in DB" };
  }
  await userRef.update({
    states: { fed: true },
  });
};
