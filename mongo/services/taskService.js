const TaskModel = require("../models/taskModel");

class TaskService {
  static async getAll() {
    return TaskModel.find({}).sort({ createdAt: -1 }).exec();
  }

  static async getOne(taskId) {
    return TaskModel.findById(taskId).exec();
  }

  static async create(data) {
    const task = new TaskModel(data);
    return task.save();
  }
}

module.exports = TaskService;
