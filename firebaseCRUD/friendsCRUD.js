const db = require("../db");

const getFriendsSubFunc = async (userId) => {
  const userRef = db.collection("users").doc(userId);

  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    return false;
  }
  const userData = userDoc.data();
  let friends = userData?.friendsArr || [];

  return { friends, userRef, userData, userDoc };
};

const inviteFriend = async (userId, friendId) => {
  const user = await getFriendsSubFunc(userId);
  if (user.friends.includes(friendId)) {
    return false;
  }

  const newUser = await getFriendsSubFunc(friendId);
  if (!newUser) {
    return false;
  }
  const newUserFriendsArr = newUser.friends || [];
  newUserFriendsArr.push(userId);

  newUser.userRef.update({
    friendsArr: newUserFriendsArr,
  });

  let friendsInvited = newUser.friendsInvited || 0;
  friendsInvited += 1;
  const friendsArr = user.friends || [];
  friendsArr.push(friendId);

  user.userRef.update({
    friendsArr,
    friendsInvited,
  });

  return true;
};

const getFriends = async (userId) => {
  const dbUsers = db.collection("users");
  const userRef = dbUsers.doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();
  const friendsRefs = [];
  if (!userData.friends) {
    return [];
  }
  userData.friends.forEach(async (el) => {
    friendsWithMoney.push(await dbUsers.doc(el).get().data());
  });
  const arrNameMoney = [];
  friendsRefs.forEach((el) => {
    arrNameMoney.push({ name: el.name, money: el.money });
  });
  return arrNameMoney;
};

module.exports = {
  getFriends,
  inviteFriend,
};
