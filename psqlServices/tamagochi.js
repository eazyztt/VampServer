const e = require("express");
const User = require("../psqlModels/user"); // Импортируем модель User

// services/CharacterService.js

class VampStatus {
  static async updateStatus(id) {
    const user = await User.findByPk(id);
    if (!user) {
      return false;
    }

    const now = new Date();
    const eightHoursInMs = 8 * 60 * 60 * 1000;

    // Проверка времени кормления
    if (now - user.lastFed > eightHoursInMs) {
      user.isHungry = true;
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

    user.lastFed = new Date();
    user.isHungry = false;
    await user.save();
  }

  static async wash(id) {
    const user = await User.findByPk(id);
    user.lastWashed = new Date();
    user.isDirty = false;
    await user.save();
  }

  static async sleep(id) {
    const user = await User.findByPk(id);
    user.lastSlept = new Date();
    user.isTired = false;
    await user.save();
  }
}

module.exports = VampStatus;
