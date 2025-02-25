const User = require("../psqlModels/user"); // Импортируем модель User

class Premium {
  static async addPremium(days, userId) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const user = await User.findOne({ where: { telegramId: userId } });
    user.premiumDays = date;
    await user.save();
  }

  static async resurrect(userId) {
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
}

module.exports = Premium;
