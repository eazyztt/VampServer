require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.PSQL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // разрешаем небезопасное подключение для отладки
    },
  },
  logging: false,
});

module.exports = sequelize;
