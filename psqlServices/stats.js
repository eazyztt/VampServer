const User = require("../psqlModels/user"); // Импортируем модель User
const Stats = require("../psqlModels/stats")

class usersStats {
  static async sexStats() {
    usersGirls = await User.count({
      where: {
        sex: "girl",
      },
    });
    usersBoys = await User.count({
      where: {
        sex: "boy",
      },
    });
    usersBoysMoney = await User
    const stat = await Stats.create({

    })

  }

  static async 
}

module.exports = usersStats