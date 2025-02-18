const { DataTypes, Model } = require("sequelize");
const sequelize = require("../psqlDb");
const User = require("./user"); // Подключаем модель User для создания связи

const Payment = sequelize.define(
  "Payment",
  {
    order_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    total_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    telegram_payment_charge_id: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "payments",
    timestamps: true,
  }
);

// Связь «каждая задача принадлежит одному пользователю»
Payment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Связь «пользователь может иметь много задач»
User.hasMany(Payment, {
  as: "payments", // Связь для задач
  foreignKey: "userId",
});

module.exports = Payment;
