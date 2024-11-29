const User = require("../psqlModels/user"); // Подключаем модель User

class FriendService {
  // Функция для добавления друга
  static async addUniqueFriend(userId, friendId) {
    // Находим пользователя и друга по их telegramId
    const user = await User.findOne({ where: { telegramId: userId } });
    const friend = await User.findOne({ where: { telegramId: friendId } });

    if (!user || !friend) {
      console.log("Один из пользователей не найден.");
      return; // Останавливаем выполнение, если пользователь или друг не найдены
    }

    // Проверяем, есть ли friend уже в списке друзей user
    const existingFriends = await user.getFriends({
      where: { telegramId: friendId },
    });

    if (existingFriends.length > 0) {
      console.log(`${friend.username} уже является другом ${user.username}`);
      return; // Останавливаем выполнение, если друг уже добавлен
    }

    // Добавляем друга, если его ещё нет в списке друзей
    await user.addFriend(friend);
    user.invitedFriends += 1; // логика инвайта
    user.earnedPoint += 500;
    await user.save(); // логика инвайта

    console.log(
      `${friend.username} успешно добавлен в друзья ${user.username}`
    );
  }

  // Функция для получения списка друзей пользователя
  static async getFriendsFunc(userId) {
    try {
      const user = await User.findOne({ where: { telegramId: userId } });
      const existingFriends = await user.getFriends({
        attributes: ["username", "lvl", ["money", "earned"]],
        order: [["money", "DESC"]],
        limit: 5,
      });

      return {
        friends: existingFriends,
        friendsInvited: user.friendsInvited,
        earned: user.earned,
      };
    } catch (e) {
      return false;
    }
  }
}

module.exports = FriendService;
