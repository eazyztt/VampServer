const User = require("../psqlModels/user"); // Подключаем модель User
const UserFriends = require("../psqlModels/userFriends");

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
    await friend.addFriend(user);
    user.friendsInvited += 1; // логика инвайта
    user.earned += 500;
    await user.save(); // логика инвайта

    console.log(
      `${friend.username} успешно добавлен в друзья ${user.username}`
    );
  }

  // Функция для получения списка друзей пользователя
  static async getFriendsFunc(telegramId) {
    try {
      const user = await User.findOne({ where: { telegramId: telegramId } });
      const existingFriends = await user.getFriends({
        attributes: ["username", "lvl", ["money", "earned"]],
        order: [["money", "DESC"]],
        limit: 5,
      });

      const friendRelations = await UserFriends.findAll({
        where: { userId: telegramId },
      });

      // Если нет связей, возвращаем пустой массив
      if (!friendRelations.length) return [];

      // 2. Собираем все friendId из связей
      const friendIds = friendRelations.map((rel) => rel.friendId);

      // 3. Ищем всех пользователей с этими ID
      const friends = await User.findAll({
        where: {
          telegramId: friendIds,
        },
        attributes: ["username", "lvl", ["money", "earned"]],
        limit: 10,
      });

      return {
        friends: friends,
        friendsInvited: user.friendsInvited,
        earned: user.earned,
        place: user.place,
      };
    } catch (e) {
      console.log(e);

      return false;
    }
  }

  static async claimFromInvites(userId) {
    try {
      const user = await User.findOne({ where: { telegramId: userId } });
      if (!user) {
        throw new Error("No user");
      }
      if (user.earned > 0) {
        user.money += user.earned;
        user.earned = 0;
        await user.save();
      }
      return {
        msg: "Success",
        money: user.money,
      };
    } catch (err) {
      return err;
    }
  }
}

module.exports = FriendService;
