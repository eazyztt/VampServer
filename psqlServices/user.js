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

  static async claimMoneyFromInvites(id) {
    const user = await User.findOne({
      where: { telegramId: id },
    });

    if (!user) {
      return false;
    }
    user.money += user.earnedPoint;

    user.earnedPoint = 0;

    await user.save();

    return user;
  }

  static async leaderboard() {
    const users = await User.findAll({
      order: [["money", "DESC"]],
      attributes: ["username", "money", "lvl"],
      limit: 10,
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
    return user;
  }

  // static async updateUserLvl(id) {
  //   const user = await User.findByPk(id, {
  //     include: [
  //       {
  //         model: Task,
  //         as: "tasks",
  //       },
  //     ],
  //   });

  //   if (!user) {
  //     throw new Error("User not found");
  //   }

  //   // Задачи пользователя, совпадающие с уровнем
  //   const userTasksMatchingLvl = user.tasks.filter(
  //     (task) => task.lvl === user.lvl
  //   );

  //   // Все задачи, совпадающие с уровнем пользователя
  //   const allTasks = await TaskService.getAllTasks();
  //   const allTasksMatchingUserLvl = allTasks.filter(
  //     (task) => task.lvl === user.lvl
  //   );

  //   // Проверяем, завершены ли все задачи текущего уровня
  //   if (allTasksMatchingUserLvl.length === userTasksMatchingLvl.length) {
  //     user.lvl += 1;
  //     await user.save();
  //     return user.lvl;
  //   } else {
  //     return false;
  //   }
  // }

  static async updateUserLevel(userId) {
    console.log("this is our appppp");

    try {
      // Находим пользователя по ID
      const user = await User.findOne({
        where: { telegramId: userId },
      });

      if (!user) {
        console.log(`Пользователь с ID ${userId} не найден.`);
        return;
      }

      const { lvl, money } = user;
      let completedTasksCount;

      if (lvl === 1 && money >= 1000) {
        console.log("stop here");

        // Проверяем выполненные задачи уровня 1
        completedTasksCount = await Task.count({
          where: {
            userId,
            lvl: 1,
            isCompleted: true,
          },
        });
        console.log(completedTasksCount);

        // Если выполнено 4 задачи уровня 1, обновляем уровень на 2
        if (completedTasksCount >= 3) {
          await user.update({ lvl: 2 });
          console.log(`Пользователь ${userId} повысил уровень с 1 до 2.`);
        }
      }

      if (lvl === 2 && money >= 2000) {
        // Проверяем выполненные задачи уровня 2
        completedTasksCount = await Task.count({
          where: {
            userId,
            lvl: 2,
            isCompleted: true,
          },
        });

        // Если выполнено 3 задачи уровня 2, обновляем уровень на 3
        if (completedTasksCount >= 2) {
          await user.update({ lvl: 3 });
          console.log(`Пользователь ${userId} повысил уровень с 2 до 3.`);
        }
      }

      if (lvl === 3 && money >= 3000) {
        // Проверяем выполненные задачи уровня 3
        completedTasksCount = await Task.count({
          where: {
            userId,
            lvl: 3,
            isCompleted: true,
          },
        });

        // Если выполнена 1 задача уровня 3, обновляем уровень на 4
        if (completedTasksCount >= 1) {
          await user.update({ lvl: 4 });
          console.log(`Пользователь ${userId} повысил уровень с 3 до 4.`);
        }
      }
      return user;
    } catch (error) {
      console.error("Ошибка при обновлении уровня пользователя:", error);
      throw new Error("Не удалось обновить уровень пользователя.");
    }
  }
}

module.exports = UserService;
