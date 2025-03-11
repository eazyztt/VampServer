const User = require("../psqlModels/user"); // Импортируем модель User

class Premium {
  static async addPremium(days, userId) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const user = await User.findOne({ where: { telegramId: userId } });
    const dateFormatted = this.dateToFormat(date);
    user.premiumDays = dateFormatted;
    await user.save();
  }

  static async resurrect(userId) {
    console.log("function is called");

    const user = await User.findOne({ where: { telegramId: userId } });
    const date = new Date();
    date.setHours(date.getHours() - 8);
    user.isDead = false;
    user.lastFed = date;
    user.lastWashed = date;
    user.lastSlept = date;
    user.lastPlayed = date;
    await user.save();
  }
  static dateToFormat(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
}

module.exports = Premium;
