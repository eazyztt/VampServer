const e = require("express");
const User = require("../psqlModels/user"); // Импортируем модель User

// services/CharacterService.js

class VampStatus {
  static async updateStatus(id) {
    const user = await User.findByPk(id);
    //console.log(`our user is going ${user}`);

    if (!user) {
      return false;
    }

    const now = new Date();
    const eightHoursInMs = 8 * 60 * 60 * 1000;
    const twelveHoursInMs = 12 * 60 * 60 * 1000;

    if (
      now - user.lastFed > twelveHoursInMs ||
      now - user.lastWashed > twelveHoursInMs ||
      now - user.lastSlept > twelveHoursInMs ||
      now - user.lastPlayed > twelveHoursInMs
    ) {
      user.isDead = true;
    }

    // Проверка времени кормления
    if (now - user.lastFed > eightHoursInMs) {
      user.isHungry = true;
    }

    if (now - user.lastFed > eightHoursInMs) {
      user.isBored = true;
    }

    // Проверка времени мытья
    if (now - user.lastWashed > eightHoursInMs) {
      user.isDirty = true;
    }

    // Проверка времени сна
    if (now - user.lastSlept > eightHoursInMs) {
      user.isTired = true;
    }

    await user.save();
    return user;
  }

  static async feed(id) {
    const user = await User.findByPk(id);

    if (now - user.lastFed < eightHoursInMs) {
      throw new Error("Too early to feed!");
    }

    user.lastFed = new Date();
    user.isHungry = false;
    user.exp += 50;
    await user.save();
  }

  static async wash(id) {
    const user = await User.findByPk(id);

    if (now - user.lastWashed < eightHoursInMs) {
      throw new Error("Too early to wash!");
    }

    user.lastWashed = new Date();
    user.isDirty = false;
    user.exp += 50;
    await user.save();
  }

  static async sleep(id) {
    const user = await User.findByPk(id);

    if (now - user.lastFed < eightHoursInMs) {
      throw new Error("Too early to sleep!");
    }

    user.lastSlept = new Date();
    user.isTired = false;
    user.exp += 50;
    await user.save();
  }

  static async rock(id) {
    const user = await User.findByPk(id);

    if (now - user.lastFed < eightHoursInMs) {
      throw new Error("Too early to rock!");
    }

    user.lastPlayed = new Date();
    user.isBored = false;
    user.exp += 50;
    await user.save();
  }
}

module.exports = VampStatus;
