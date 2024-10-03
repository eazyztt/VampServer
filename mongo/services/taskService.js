const TaskModel = require("../models/taskModel");
const UserModel = require("../models/userModel");

class TaskService {
  static async getAllTasks() {
    const tasks = TaskModel.find({});
    return tasks;
  }

  static async completeTask(userId, taskId) {
    let user = await UserModel.findById(userId);
    const task = await TaskModel.findById(taskId);
    console.log(task);

    if (user.tasks.length === 0) {
      user.tasks.push(task);

      user.save();
      return user.tasks;
    }
    if (user.tasks.find(usrTask.id === task._id)) {
      throw new Error("Task already completed");
    }

    user.tasks.push(task);

    user.save();

    return user.tasks;
  }

  static async getUserTasks(userId) {
    const tasks = [];
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("No user in db");
    }
    for (const task of user.tasks) {
      console.log(task);

      const newTask = await TaskModel.findById(task.id);
      tasks.push({
        lvl: newTask.lvl,
        title: newTask.title,
        description: newTask.description,
      });
    }
    return tasks;
  }
}

module.exports = TaskService;
