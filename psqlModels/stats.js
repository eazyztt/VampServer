const { DataTypes, Model } = require("sequelize");
const sequelize = require("../psqlDb");

class stats extends Model {}

stats.init(
  {
    girlsTotalMoney: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    boysTotalMoney: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    boysAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    girlsAmount: {
      type: DataTypes.INTEGER,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "stats",
    timestamps: false,
  }
);

module.exports = stats;
