const { DataTypes, Model } = require("sequelize");
const sequelize = require("../psqlDb");
const Task = require("./task");
const Friendship = require("./friendship");

class User extends Model {}

User.init(
  {
    telegramId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    money: {
      type: DataTypes.STRING,
      defaultValue: "1000",
    },
    readyToClaim: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    skin: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    lastClaim: {
      type: DataTypes.INTEGER, // PostgreSQL не имеет поля Date по умолчанию, Integer для соответствия структуре
      defaultValue: 100,
    },
    moneyForClaim: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    hash: {
      type: DataTypes.STRING,
    },
    lvl: {
      type: DataTypes.STRING,
      defaultValue: "1",
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: false, // Выключение временных меток createdAt и updatedAt
  }
);

// Описание ассоциаций и вложенных структур

User.hasMany(Task, {
  as: "tasks", // Связь для задач
  foreignKey: "userId",
});

User.belongsToMany(User, {
  as: "friends",
  through: Friendship,
  foreignKey: "userId",
  otherKey: "friendId",
});

module.exports = User;
