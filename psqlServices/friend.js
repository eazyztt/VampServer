const User = require("../psqlModels/user"); // Подключаем модель User
const Friendship = require("../psqlModels/friendship"); // Подключаем модель Friendship

class FriendService {
  // Получение списка друзей пользователя
  static async getFriends(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: "friends",
          through: {
            model: Friendship,
            attributes: ["invitedByMe"], // Включаем только поле invitedByMe из промежуточной таблицы
          },
          attributes: ["username", "moneyForClaim", "lvl"], // Включаем только нужные поля из друзей
        },
      ],
    });

    if (!user) {
      throw new Error("No user in DB");
    }

    // Формируем список друзей
    const friends = user.friends.map((friend) => ({
      name: friend.username,
      invitedByMe: friend.Friendship.invitedByMe, // Поле из промежуточной таблицы
      moneyForClaim: friend.moneyForClaim,
      lvl: friend.lvl,
    }));

    return friends;
  }

  // Добавление друга к пользователю
  static async addFriendToUser(userId, friendId) {
    const user = await User.findByPk(userId);
    const friend = await User.findByPk(friendId);

    if (!user) {
      throw new Error("No user in DB");
    }
    if (!friend) {
      throw new Error("No friend in DB");
    }

    // Добавляем запись в таблицу Friendship для обоих пользователей
    await Friendship.create({
      userId: user.id,
      friendId: friend.id,
      invitedByMe: true,
    });

    await Friendship.create({
      userId: friend.id,
      friendId: user.id,
      invitedByMe: false,
    });

    return "Successfully added to friend list";
  }
}

module.exports = FriendService;
