const TaskModel = require("../models/taskModel");
const UserModel = require("../models/userModel");

class TaskService {
  static async getAllTasks() {
    const tasks = TaskModel.find({});
    return tasks;
  }

  static async completeTask(userId, taskId) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error("No user in db");
    }

    let completedTask = user.tasks.find((task) => task.id == taskId);

    if (!completedTask) {
      throw new Error("No such task in database");
    }

    if (completedTask.isCompleted == true) {
      throw new Error("Task is already completed");
    }

    completedTask.isCompleted = true;

    user.tasks = user.tasks.map((task) =>
      task.id === completedTask.id ? completedTask : task
    );

    user.save();

    return "Task is completed";
  }

  static async getUserTasks(userId) {
    const tasks = [];
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("No user in db");
    }
    for (const task of user.tasks) {
      const newTask = await TaskModel.findById(task.id);
      tasks.push({
        title: newTask.title,
        description: newTask.description,
        isCompleted: task.isCompleted,
      });
    }
    return tasks;
  }
}

module.exports = TaskService;
