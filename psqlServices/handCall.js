const User = require("../psqlModels/user"); // Импортируем модель User
const Task = require("../psqlModels/task");
const TaskAll = require("../psqlModels/taskForAll");

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

  static async updateUserLevels() {
    try {
      // Получаем всех пользователей
      const users = await User.findAll();

      // Проходим по каждому пользователю
      for (const user of users) {
        const userId = user.id; // ID пользователя
        const currentLevel = user.lvl; // Текущий уровень пользователя

        let completedTasksCount;

        switch (currentLevel) {
          case 1:
            // Подсчитываем выполненные задачи уровня 1
            completedTasksCount = await Task.count({
              where: {
                userId,
                lvl: 1,
                isCompleted: true,
              },
            });

            // Если выполнено >= 4 задач уровня 1, обновляем уровень на 2
            if (completedTasksCount >= 4) {
              await user.update({ lvl: 2 });
              console.log(`Пользователь ${userId} повысил уровень с 1 до 2.`);
            }
            break;

          case 2:
            // Подсчитываем выполненные задачи уровня 2
            completedTasksCount = await Task.count({
              where: {
                userId,
                lvl: 2,
                isCompleted: true,
              },
            });

            // Если выполнено >= 3 задач уровня 2, обновляем уровень на 3
            if (completedTasksCount >= 3) {
              await user.update({ lvl: 3 });
              console.log(`Пользователь ${userId} повысил уровень с 2 до 3.`);
            }
            break;

          case 3:
            // Подсчитываем выполненные задачи уровня 3
            completedTasksCount = await Task.count({
              where: {
                userId,
                lvl: 3,
                isCompleted: true,
              },
            });

            // Если выполнено >= 1 задачи уровня 3, обновляем уровень на 4
            if (completedTasksCount >= 1) {
              await user.update({ lvl: 4 });
              console.log(`Пользователь ${userId} повысил уровень с 3 до 4.`);
            }
            break;

          default:
            console.log(
              `Пользователь ${userId} находится на уровне ${currentLevel}, проверка не требуется.`
            );
        }
      }
    } catch (error) {
      console.error("Ошибка при обновлении уровней пользователей:", error);
      throw new Error("Не удалось обновить уровни пользователей.");
    }
  }

  static async completeInProgressTasks() {
    try {
      // Обновляем все задачи, которые соответствуют критериям
      const [affectedRows] = await Task.update(
        { isCompleted: true }, // Новое значение
        {
          where: {
            isProgress: true,
            isCompleted: false,
          },
        }
      );

      console.log(`Обновлено задач: ${affectedRows}`);
    } catch (error) {
      console.error("Ошибка при обновлении задач:", error);
      throw new Error("Не удалось обновить задачи.");
    }
  }
}

module.exports = handCall;
