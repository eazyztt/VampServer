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
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (
      now - user.lastFed > twentyFourHours ||
      now - user.lastWashed > twentyFourHours ||
      now - user.lastSlept > twentyFourHours ||
      now - user.lastPlayed > twentyFourHours
    ) {
      user.isDead = true;
    }

    //Логика для проверки первые ли разы заходит юзер

    if (
      user.lastFed <= new Date("2005-09-02T20:00:00Z") &&
      user.lastPlayed <= new Date("2005-09-02T20:00:00Z") &&
      user.lastSlept <= new Date("2005-09-02T20:00:00Z") &&
      user.lastWashed <= new Date("2005-09-02T20:00:00Z")
    ) {
      user.isDead = false;
    }

    // Проверка времени кормления
    if (
      now - user.lastFed > eightHoursInMs &&
      user.lastFed > new Date("2005-09-02T20:00:00Z")
    ) {
      user.isHungry = true;
    }

    if (
      now - user.lastFed > eightHoursInMs &&
      user.lastFed > new Date("2005-09-02T20:00:00Z")
    ) {
      user.isBored = true;
    }

    // Проверка времени мытья
    if (
      now - user.lastWashed > eightHoursInMs &&
      user.lastFed > new Date("2005-09-02T20:00:00Z")
    ) {
      user.isDirty = true;
    }

    // Проверка времени сна
    if (
      now - user.lastSlept > eightHoursInMs &&
      user.lastFed > new Date("2005-09-02T20:00:00Z")
    ) {
      user.isTired = true;
    }

    await user.save();
    return user;
  }

  static async feed(id) {
    const user = await User.findByPk(id);

    const now = new Date();
    const eightHoursInMs = 8 * 60 * 60 * 1000;

    if (
      now - user.lastFed < eightHoursInMs &&
      user.lastFed > new Date("2005-09-02T20:00:00Z")
    ) {
      return { early: "yes" };
    }

    let experience = 0;

    if (user.lvl === 1) {
      experience = 100;
    } else if (user.lvl === 2) {
      experience = 200;
    } else if (user.lvl === 3) {
      experience = 300;
    } else if (user.lvl === 4) {
      experience = 400;
    }

    user.lastFed = new Date();
    user.isHungry = false;
    user.money += experience;
    await user.save();
    return user;
  }

  static async wash(id) {
    const user = await User.findByPk(id);

    const now = new Date();
    const eightHoursInMs = 8 * 60 * 60 * 1000;

    if (
      now - user.lastWashed < eightHoursInMs &&
      user.lastFed > new Date("2005-09-02T20:00:00Z")
    ) {
      return { early: "yes" };
    }

    let experience = 0;

    if (user.lvl === 1) {
      experience = 100;
    } else if (user.lvl === 2) {
      experience = 200;
    } else if (user.lvl === 3) {
      experience = 300;
    } else if (user.lvl === 4) {
      experience = 400;
    }

    user.lastWashed = new Date();
    user.isDirty = false;
    user.money += experience;
    await user.save();
    return user;
  }

  static async sleep(id) {
    const user = await User.findByPk(id);

    const now = new Date();
    const eightHoursInMs = 8 * 60 * 60 * 1000;

    if (
      now - user.lastFed < eightHoursInMs &&
      user.lastFed > new Date("2005-09-02T20:00:00Z")
    ) {
      return { early: "yes" };
    }

    let experience = 0;

    if (user.lvl === 1) {
      experience = 100;
    } else if (user.lvl === 2) {
      experience = 200;
    } else if (user.lvl === 3) {
      experience = 300;
    } else if (user.lvl === 4) {
      experience = 400;
    }

    user.lastSlept = new Date();
    user.isTired = false;
    user.money += experience;
    await user.save();
    return user;
  }

  static async rock(id) {
    const user = await User.findByPk(id);

    const now = new Date();
    const eightHoursInMs = 8 * 60 * 60 * 1000;

    if (
      now - user.lastFed < eightHoursInMs &&
      user.lastFed > new Date("2005-09-02T20:00:00Z")
    ) {
      return { early: "yes" };
    }

    let experience = 0;

    if (user.lvl === 1) {
      experience = 100;
    } else if (user.lvl === 2) {
      experience = 200;
    } else if (user.lvl === 3) {
      experience = 300;
    } else if (user.lvl === 4) {
      experience = 400;
    }

    user.lastPlayed = new Date();
    user.isBored = false;
    user.money += experience;
    await user.save();
    return user;
  }
}

module.exports = VampStatus;
