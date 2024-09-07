const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
const TaskService = require("../services/taskService");
const improveModel = require("../models/improveModel");

class UserService {
  static async create(data) {
    const user = new userModel(data);
    return user.save();
  }

  static async getUserInfo(id) {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("No such user in our database");
    }
    return {
      _id: user._id,
      name: user.name,
      telegramId: user.telegramId,
      money: user.money,
      moneyForClaim: user.moneyForClaim,
    };
  }

  static async getHash(userId) {
    const user = await userModel.getById(userId);
    return user.hash;
  }
}

module.exports = UserService;
