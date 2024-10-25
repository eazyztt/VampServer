const { DataTypes, Model } = require("sequelize");
const sequelize = require("../psqlDb");

class Friendship extends Model {}

Friendship.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Указываем таблицу пользователей
        key: "id",
      },
    },
    friendId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invitedByMe: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Friendship",
    timestamps: false,
  }
);

module.exports = Friendship;
