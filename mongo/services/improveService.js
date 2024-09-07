const improveModel = require("../models/improveModel");
const userModel = require("../models/userModel");

class ImproveService {
  static async getAll() {
    return await improveModel.find({}).sort({ createdAt: -1 });
  }

  static async purchaseImprovement(userId, id) {
    const newUserImprovement = {
      improveId: id,
      lvl: 1,
    };
    const user = await userModel.findById(userId);
    const improve = await improveModel.findById(id);
    const userTargetImprove = user.improves.find((el) => el.improveId == id);

    console.log(improve);

    if (!improve.globallyAble) {
      throw new Error("Improvement is disabled");
    }

    if (userTargetImprove) {
      throw new Error("User already purchased building");
    }

    if (user.money >= improve.initPrice) {
      user.improves.push({
        ...newUserImprovement,
        price: improve.initPrice,
        income: improve.initIncome,
      });
      user.money -= improve.initPrice;
      user.moneyForClaim += improve.initIncome;
      user.save();
      return "Successfully purchased";
    } else {
      throw new Error("You have not enough money to purchase that");
    }
  }

  static async updateImprovement(userId, id) {
    const improve = await improveModel.findById(id);

    if (!improve.globallyAble) {
      throw new Error("Improvement is disabled");
    }

    const user = await userModel.findById(userId);
    let userImproves = user.improves;
    const targetImprove = userImproves.find((impr) => impr.improveId == id);

    const incomeFromUpdatedIpmrove =
      targetImprove.lvl * improve.coefIncome * improve.initIncome;

    const moneyToUpdate =
      targetImprove.lvl * improve.coefPrice * improve.initPrice;

    if (user.money >= moneyToUpdate) {
      targetImprove.lvl++;
      targetImprove.price = moneyToUpdate;
      targetImprove.income = incomeFromUpdatedIpmrove;

      userImproves = userImproves.map((x) =>
        x.id === targetImprove.id ? targetImprove : x
      );

      user.improves = userImproves;
      user.money -= moneyToUpdate;
      user.moneyForClaim += incomeFromUpdatedIpmrove;

      user.save();
      return "Successfully updated";
    } else {
      throw new Error("You have not enough money to purchase that");
    }
  }

  static async getUserImprovements(userId) {
    const improves = [];
    const user = await userModel.findById(userId);
    for (const improve of user.improves) {
      const impro = await improveModel.findById(improve.improveId);
      improves.push({
        lvl: improve.lvl,
        name: impro.name,
        desc: impro.desc,
        price: improve.price,
        income: improve.income,
      });
    }
    return improves;
  }
}

module.exports = ImproveService;
