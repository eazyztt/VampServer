const { DataTypes, Model } = require("sequelize");
const sequelize = require("../psqlDb");
const User = require("./user"); // Подключаем модель User для создания связи

class Task extends Model {}

Task.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Task",
    timestamps: false,
  }
);

// Указываем, что каждая задача принадлежит одному пользователю
Task.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = Task;
