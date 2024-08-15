const db = require("../db");

const getFriends = async (userId) => {
  const friendsRef = db.collection("users").doc(userId).collection("friends");
  const friendsDoc = await friendsRef.get();

  let userFriends = [];

  if (!friendsDoc.exists) {
    userFriends = [];
  }

  friendsDoc.forEach((doc) => {
    userFriends.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return userFriends;
};

const addFriend = async (userId, friendId) => {
  const userFriendsRef = db
    .collection("users")
    .doc(userId)
    .collection("friends")
    .doc(friendId);

  const friends = await getFriends(friendId);

  const friend = friends.find((friend) => (friend.id = friendId));

  if (friend) {
    return false;
  }

  const invitedFriendRef = db.collection("users").doc(friendId);
  const invitedFriendFriendsRef = db
    .collection("users")
    .doc(friendId)
    .collection("friends")
    .doc(userId);

  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();

  const invitedFriendDoc = await invitedFriendRef.get();

  if (!invitedFriendDoc.exists) {
    return false;
  }

  const invitedFriendData = invitedFriendDoc.data();

  await userFriendsRef.set({
    username: invitedFriendData.username,
    id: invitedFriendData.id,
    createdAt: Date.now(),
    invitedByMe: true,
  });

  await userRef.update({
    friendsInvited: userData.friendsInvited + 1,
  });

  await invitedFriendFriendsRef.set({
    username: userData.username,
    id: userData.id,
    createdAt: Date.now(),
    invitedByMe: false,
  });

  return true;
};

module.exports = {
  getFriends,
  addFriend,
};
