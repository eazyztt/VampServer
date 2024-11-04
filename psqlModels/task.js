const { DataTypes, Model } = require("sequelize");
const sequelize = require("../psqlDb");
const User = require("./user"); // Подключаем модель User для создания связи

const Task = sequelize.define(
  "Task",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    description: {
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
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "telegramId",
      },
    },
  },
  {
    tableName: "tasks",
    timestamps: false,
  }
);

// Связь «каждая задача принадлежит одному пользователю»
Task.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Связь «пользователь может иметь много задач»
User.hasMany(Task, {
  as: "tasks", // Связь для задач
  foreignKey: "userId",
});

module.exports = Task;
