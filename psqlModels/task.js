const { DataTypes, Model } = require("sequelize");
const sequelize = require("../psqlDb");
const User = require("./user"); // Подключаем модель User для создания связи
const TaskAll = require("./taskForAll");

const Task = sequelize.define(
  "Task",
  {
    title: {
      type: DataTypes.STRING,
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
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TaskAll,
        key: "id",
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
