const User = require("../psqlModels/user"); // Импортируем модель User
const Task = require("../psqlModels/task"); // Импортируем модель Task

const TaskService = require("../psqlServices/task"); // Импортируем сервис задач

class UserService {
  static async create(data) {
    try {
      const user = await User.create(data);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async getFullUser(id) {
    const user = await User.findOne({
      where: { telegramId: id },
    });

    if (!user) {
      return false;
    }

    return user;
  }

  static async leaderboard() {
    const users = await User.findAll({
      order: [["money", "DESC"]],
      limit: 20,
    });
    return users;
  }

  static async getUserInfo(id) {
    const user = await User.findOne({
      where: { telegramId: id },
      attributes: [
        "username",
        "money",
        "lastClaim",
        "lvl",
        "isHungry",
        "isTired",
        "isDirty",
      ],
    });

    if (!user) {
      throw new Error("No valid user");
    }

    return user;
  }

  static async getHash(userId) {
    const user = await User.findByPk(userId, {
      attributes: ["hash"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.hash;
  }

  static async claimMoney(id) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    const moneyForClaim = user.moneyForClaim;
    const lastClaim = user.lastClaim;
    const currentTime = Date.now();
    const diffInHours = (currentTime - lastClaim) / 1000 / 60 / 60;

    if (diffInHours >= 1 / 60) {
      // Заменить 1/60 на нужный интервал
      user.money = parseInt(user.money) + moneyForClaim;
      user.readyToClaim = false;
      user.lastClaim = currentTime;
      await user.save();
      return user;
    } else {
      return false;
    }
  }

  static async chooseSex(id, sex) {
    const user = await User.findByPk(id);
    user.sex = sex;
    await user.save();
  }

  static async updateUserLvl(id) {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Task,
          as: "tasks",
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Задачи пользователя, совпадающие с уровнем
    const userTasksMatchingLvl = user.tasks.filter(
      (task) => task.lvl === user.lvl
    );

    // Все задачи, совпадающие с уровнем пользователя
    const allTasks = await TaskService.getAllTasks();
    const allTasksMatchingUserLvl = allTasks.filter(
      (task) => task.lvl === user.lvl
    );

    // Проверяем, завершены ли все задачи текущего уровня
    if (allTasksMatchingUserLvl.length === userTasksMatchingLvl.length) {
      user.lvl += 1;
      await user.save();
      return user.lvl;
    } else {
      return false;
    }
  }
}

module.exports = UserService;
