const User = require("../psqlModels/user"); // Импортируем модель User
const Task = require("../psqlModels/task"); // Импортируем модель Task
const TaskAll = require("../psqlModels/taskForAll");

class TaskService {
  // Синхронизация задач из TaskAll с задачами пользователя
  static async syncTasksWithUser(userId) {
    try {
      // Получаем пользователя с уровнем
      const user = await User.findOne({ where: { telegramId: userId } });
      if (!user) {
        throw new Error("Пользователь не найден.");
      }

      // Получаем все задачи из TaskAll, соответствующие уровню пользователя
      const allTasks = await TaskAll.findAll({ where: { lvl: user.lvl } });

      // Получаем задачи пользователя
      const userTasks = await Task.findAll({ where: { userId } });

      // Преобразуем задачи пользователя в объект для быстрого поиска по title
      const userTasksMap = userTasks.reduce((acc, task) => {
        acc[task.title] = task;
        return acc;
      }, {});

      // Итерация по задачам из TaskAll
      for (const task of allTasks) {
        if (!userTasksMap[task.title]) {
          await Task.create({
            mainTaskId: task.id,
            title: task.title,
            link: task.link,
            lvl: task.lvl,
            isProgress: task.isProgress,
            isCompleted: task.isCompleted,
            userId,
          });
        }
      }

      // Возвращаем обновленный список задач пользователя
      const updatedUserTasks = await Task.findAll({
        where: { userId, lvl: user.lvl },
      });

      return {
        tasks: updatedUserTasks,
        lvl: user.lvl,
        sex: user.sex,
        points: user.money,
        finalPoints: 2000,
      };
    } catch (error) {
      console.error("Ошибка при синхронизации задач:", error);
      throw new Error("Не удалось синхронизировать задачи.");
    }
  }

  // Обновление статуса задачи на isProgress = true
  static async markTaskInProgress(taskId, userId) {
    console.log(`this is task id ${taskId}`);
    if (taskId === 432467) {
      const user = await User.findOne({ where: { telegramId: userId } });
      if (user.friendsInvited !== 1) {
        return { success: false, message: "Условия не выполнены." };
      }
    }
    if (taskId === 434890) {
      const user = await User.findOne({ where: { telegramId: userId } });
      if (user.friendsInvited !== 3) {
        return { success: false, message: "Условия не выполнены." };
      }
    }
    try {
      // Находим задачу пользователя
      const task = await Task.findOne({
        where: { id: taskId, userId: userId },
      });

      console.log(`this is our task ${task}`);

      if (!task) {
        return { success: false, message: "Задача не найдена." };
      }

      // Обновляем статус задачи
      await task.update({ isProgress: true });

      return {
        success: true,
        message: "Задача отмечена как выполняющаяся.",
        task,
      };
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      throw new Error("Не удалось обновить статус задачи.");
    }
  }
}

module.exports = TaskService;
