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
        include: { model: Task, as: "tasks" },
      });
      if (!user) throw new Error("User not found");

      const task = await Task.findByPk(taskId);
      if (!task) throw new Error("Task not found");

      // Проверяем, завершена ли задача
      const isTaskCompleted = user.tasks.some(
        (userTask) => userTask.id === task.id
      );
      if (isTaskCompleted) {
        throw new Error("Task already completed");
      }

      // Добавляем задачу к пользователю
      await user.addTask(task); // Sequelize автоматически добавит запись в связующую таблицу
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
