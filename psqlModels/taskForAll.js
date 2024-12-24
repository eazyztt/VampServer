const { DataTypes, Model } = require("sequelize");
const sequelize = require("../psqlDb");
const User = require("../psqlModels/user"); // Подключаем модель User для создания связи

class TaskAll extends Model {}

TaskAll.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lvl: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isProgress: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "TaskAll",
    timestamps: false,
  }
);

module.exports = TaskAll;
