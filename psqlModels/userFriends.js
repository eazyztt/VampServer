const { DataTypes, Model } = require("sequelize");
const sequelize = require("../psqlDb");

// Добавляем в модель перед ассоциацией
const UserFriends = sequelize.define(
  "UserFriends",
  {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    friendId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  },
  {
    tableName: "UserFriends", // явно указываем имя таблицы
    timestamps: true,
  }
);

module.exports = UserFriends;
