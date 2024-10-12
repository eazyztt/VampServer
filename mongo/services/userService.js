const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
const TaskService = require("../services/taskService");
const improveModel = require("../models/improveModel");
const { use } = require("../../routes/friends");

class UserService {
  static async create(data) {
    const user = new userModel(data);
    return user.save();
  }

  static async getUserInfo(id) {
    const user = await userModel.findOne({ telegramId: id });
    if (!user) {
      throw new Error("No such user in our database");
    }
    return {
      username: user.username,
      money: user.money,
      lastClaim: user.lastClaim,
      lvl: user.lvl,
    };
  }

  static async getHash(userId) {
    const user = await userModel.findById(userId);
    return user.hash;
  }

  static async claimMoney(id) {
    const user = await userModel.findById(id);
    const moneyForClaim = user.moneyForClaim;
    const lastClaim = user.lastClaim;
    const currentTime = Date.now();
    console.log({ lastClaim, currentTime });
    let diffInTime = (currentTime - lastClaim) / 1000 / 60 / 60;
    console.log(diffInTime);
    //const y = new Date("2013-05-23");
    if ((currentTime - lastClaim) / 1000 / 60 / 60 >= 1 / 60) {
      const money = user.money + moneyForClaim;
      user.readyToClaim = false;
      user.money = money;
      user.lastClaim = lastClaim;
      user.save();
      return user;
    } else {
      return false;
    }
  }

  static async updateUserLvl(id) {
    const userData = await userModel.findById(id);

    let userTasksMatchingLvl = [];
    for (task of userData.tasks) {
      if (task.lvl === userData.lvl) {
        userTasksMatchingLvl.push(task);
      }
    }

    const allTasks = await TaskService.getAllTasks();
    let allTasksMatchingUserLvl = [];
    for (task of allTasks) {
      if (task.lvl === userData.lvl) {
        allTasksMatchingUserLvl.push(task);
      }
    }

    if (allTasksMatchingUserLvl.length === userTasksMatchingLvl.length) {
      userData.lvl = userData.lvl += 1;
      userData.save();
      return userData.lvl;
    } else {
      return false;
    }
  }
}

module.exports = UserService;
