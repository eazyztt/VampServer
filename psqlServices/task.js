const User = require("../psqlModels/user"); // Импортируем модель User
const Task = require("../psqlModels/task"); // Импортируем модель Task
const TaskAll = require("../psqlModels/taskForAll");

class TaskService {
  static async getAllTasks() {
    try {
      const tasks = await TaskAll.findAll(); // Находим все задачи
      return tasks;
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      throw error;
    }
  }

  static async completeTask(userId, taskId) {
    try {
      const user = await User.findByPk(userId, {
        include: { model: Task, as: "tasks" }, // Подключаем задачи, связанные с пользователем
      });
      if (!user) throw new Error("User not found");

      const task = await TaskAll.findByPk(taskId); // Находим задачу из общей модели TaskAll
      if (!task) throw new Error("Task not found");

      // Проверяем, завершена ли задача пользователем
      const isTaskCompleted = user.tasks.some(
        (userTask) => userTask.id === task.id
      );
      if (isTaskCompleted) {
        throw new Error("Task already completed");
      }

      // Создаём копию задачи для пользователя
      const userTask = await Task.create({
        title: task.title,
        description: task.description,
        link: task.link,
        lvl: task.lvl,
        userId: user.telegramId,
      });

      await user.reload(); // Обновляем пользователя с новыми задачами
      return user.tasks;
    } catch (error) {
      console.error("Error completing task:", error);
      throw error;
    }
  }

  static async getUserTasks(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: { model: Task, as: "tasks" },
      });
      if (!user) {
        throw new Error("No user in db");
      }

      // Собираем задачи пользователя
      const tasks = user.tasks.map((task) => ({
        lvl: task.lvl,
        title: task.title,
        description: task.description,
      }));

      return tasks;
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      throw error;
    }
  }
}

module.exports = TaskService;
