const db = require("../db");
const verifyInitData = require("../auth/auth");
const cryptoId = require("./cryptoId");

const initUser = (id, username) => {
  const hash = cryptoId.encrypt(id, process.env.SECRET_KEY_ID);
  let lastClaim = Date.now();
  const hours = lastClaim.getHours();
  lastClaim.setHours(hours - 4);
  return {
    id: id,
    money: 1000,
    friends: [],
    lvl: 1,
    friendsInvited: 0,
    moneyForClaim: 100,
    readyToClaim: false,
    username: username,
    hash: hash,
    lastClaim: lastClaim,
  };
};

const mainAuthFunc = async (initData) => {
  let { username, id } = verifyInitData(initData);
  if (username && id) {
    const userRef = db.collection("users").doc(id);
    let userDoc = await userRef.get();
    if (!userDoc.exists) {
      const newUser = initUser(id, username);
      await userRef.set(newUser);
      console.log("User data saved to Firestore");
      return id;
    }
    return id;
  }
  return false;
};

module.exports = mainAuthFunc;
