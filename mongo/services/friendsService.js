const userModel = require("../models/userModel");

class FriendService {
  static async getFriends(userId) {
    let friends = [];
    const user = await userModel.findOne({ telegramId: userId });
    if (!user) {
      throw new Error("No user in DB");
    }
    for (const friend of user.friends) {
      const friendo = user.friends.find(friend.id);
      friends.push({
        name: friend.name,
        invitedByMe: friend.invitedByMe,
        moneyForClaim: friendo.moneyForClaim,
        lvl: friendo.lvl,
      });
    }
    return friends;
  }

  static async addFriendToUser(userId, friendId) {
    const user = await userModel.getById(userId);
    if (!user) {
      throw new Error("No user in DB");
    }

    const friend = await userModel.getById(friendId);
    if (!friend) {
      throw new Error("No friend in DB");
    }

    user.friends.push({
      id: friend.id,
      invitedByMe: true,
    });

    friend.friends.push({
      id: user.id,
      invitedByMe: false,
    });

    return "Successfully added to friend list";
  }
}

module.exports = FriendService;
