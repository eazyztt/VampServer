const { DataTypes, Model } = require("sequelize");
const sequelize = require("../psqlDb");
//const User = require("./user"); // Подключаем модель User для создания связи

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

module.exports = Task;
