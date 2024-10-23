const { Pool } = require("pg");

const pool = new Pool({
  user: "emslim", // Твой PostgreSQL пользователь
  host: "dpg-cscfknjtq21c7396a3u0-a.frankfurt-postgres.render.com",
  database: "vamp", // Имя твоей базы данных
  password: "xJdjzplBgICJBdM8b8D2gKU0WRf0WJWF", // Пароль к базе данных
  port: 5432, // Порт для подключения
  ssl: { rejectUnauthorized: false }, // Если используешь Render или другой облачный сервис
});

module.exports = pool;
