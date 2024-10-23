const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString:
    "postgresql://emslim:xJdjzplBgICJBdM8b8D2gKU0WRf0WJWF@dpg-cscfknjtq21c7396a3u0-a.frankfurt-postgres.render.com/vamp",
  ssl: {
    rejectUnauthorized: false, // Важно для безопасного подключения через SSL
  },
});

const createTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

  try {
    await pool.query(query);
    console.log("Таблица users успешно создана!");
  } catch (err) {
    console.error("Ошибка создания таблицы:", err);
  }
};

createTable();
