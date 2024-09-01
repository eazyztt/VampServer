const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
const TaskService = require("../services/taskService");

class UserService {
  static async create(data) {
    const task = await TaskService.getOne("66ce3ad95d9248e72b3d3bc0");
    console.log(task._id);

    const user = new userModel(data);
    user.tasks.push({ task: "66ce3ad95d9248e72b3d3bc0", isCompleted: false });
    user.tasks.push({ task: "66d2037a0ef5721164c08096", isCompleted: false });

    return user.save();
  }

  static async completeTask() {
    const user = userModel.findById("66cf857ef4f7b6a7a105f076").exec();

    user.then((task) => {
      task.task.isCompleted = true;
      task.save();
    });
  }

  static async getTask() {
    const tasks = [];
    const user = await userModel.findById("66d20446d0577a207072ef9e");
    for (const task of user.tasks) {
      const newTask = await taskModel.findById(task.task);
      tasks.push(newTask);
    }
    console.log(tasks);
  }
}

module.exports = UserService;
