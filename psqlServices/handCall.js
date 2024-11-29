const User = require("../psqlModels/user"); // Импортируем модель User

class handCall {
  static async updateLeaderboard() {
    const users = await User.findAll({
      order: [["money", "DESC"]],
      attributes: ["id", "money"],
    });

    // Формируем массив обновлений
    const updates = users.map((user, index) => ({
      id: user.id,
      place: index + 1,
    }));

    // Обновляем пользователей массово
    const promises = updates.map((update) =>
      User.update({ place: update.place }, { where: { id: update.id } })
    );

    await Promise.all(promises); // Параллельное выполнение всех запросов
    console.log("Leaderboard updated successfully!");
  }
}

module.exports = handCall;
