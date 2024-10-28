const { DataTypes, Model } = require("sequelize");
const sequelize = require("../psqlDb");

const User = sequelize.define(
  "User",
  {
    telegramId: {
      type: DataTypes.STRING,
      allowNull: true,
      primaryKey: true,
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
      defaultValue: "boy",
    },
    lastClaim: {
      type: DataTypes.DATE,
      defaultValue: new Date(2005, 8, 2),
    },
    moneyForClaim: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lvl: {
      type: DataTypes.STRING,
      defaultValue: "1",
    },
    lastFed: {
      type: DataTypes.DATE,
      defaultValue: new Date(2005, 8, 2),
    },
    lastWashed: {
      type: DataTypes.DATE,
      defaultValue: new Date(2005, 8, 2),
    },
    lastSlept: {
      type: DataTypes.DATE,
      defaultValue: new Date(2005, 8, 2),
    },
    isTired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isHungry: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDirty: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    exp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sex: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

// Ассоциация Friends, где один User может иметь много приглашенных друзей (также User)
User.belongsToMany(User, {
  as: "Friends", // название для доступа к друзьям
  through: "UserFriends", // промежуточная таблица
  foreignKey: "userId", // FK пользователя, у которого есть друзья
  otherKey: "friendId", // FK друга
});

module.exports = User;
