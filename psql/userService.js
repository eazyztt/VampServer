const pool = require("../psqlDb"); // Подключение к базе данных

class UserService {
  // Создание пользователя
  static async create(data) {
    const {
      telegramId,
      username,
      money,
      readyToClaim,
      skin,
      lastClaim,
      moneyForClaim,
      hash,
      lvl,
    } = data;

    const query = `
      INSERT INTO users (telegram_id, username, money, ready_to_claim, skin, last_claim, money_for_claim, hash, lvl)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      telegramId,
      username,
      money,
      readyToClaim,
      skin,
      lastClaim,
      moneyForClaim,
      hash,
      lvl,
    ];

    const result = await pool.query(query, values);
    return result.rows[0]; // Возвращаем созданного пользователя
  }

  // Получение информации о пользователе по telegramId
  static async getUserInfo(id) {
    const query = `
      SELECT username, money, last_claim AS "lastClaim", lvl
      FROM users
      WHERE telegram_id = $1
    `;

    const result = await pool.query(query, [id]);

    const user = result.rows[0];
    console.log(`this is possible error ${user}`);

    if (!user) {
      throw new Error("No such user in our database");
    }

    return user;
  }

  // Получение хэша пользователя по userId
  static async getHash(userId) {
    const query = `
      SELECT hash FROM users WHERE id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0]?.hash;
  }

  // Запрос денег (claim money)
  static async claimMoney(id) {
    const query = `
      SELECT * FROM users WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    const user = result.rows[0];

    if (!user) {
      throw new Error("User not found");
    }

    const { money_for_claim: moneyForClaim, last_claim: lastClaim } = user;
    const currentTime = Date.now();
    let diffInTime = (currentTime - lastClaim) / 1000 / 60 / 60;
    console.log(diffInTime);

    // Проверка на разницу во времени
    if (diffInTime >= 1 / 60) {
      // Если прошло >= 1 минута
      const newMoney = parseFloat(user.money) + moneyForClaim;

      const updateQuery = `
        UPDATE users
        SET ready_to_claim = false, money = $1, last_claim = $2
        WHERE id = $3
        RETURNING *
      `;
      const updateValues = [newMoney, currentTime, id];

      const updatedResult = await pool.query(updateQuery, updateValues);
      return updatedResult.rows[0]; // Возвращаем обновленного пользователя
    } else {
      return false;
    }
  }

  // Обновление уровня пользователя
  static async updateUserLvl(id) {
    const userQuery = `
      SELECT * FROM users WHERE id = $1
    `;

    const userResult = await pool.query(userQuery, [id]);
    const userData = userResult.rows[0];

    if (!userData) {
      throw new Error("User not found");
    }

    // Ищем задачи, соответствующие уровню пользователя
    const matchingTasksQuery = `
      SELECT * FROM tasks WHERE user_id = $1 AND lvl = $2
    `;

    const matchingTasksResult = await pool.query(matchingTasksQuery, [
      id,
      userData.lvl,
    ]);
    const userTasksMatchingLvl = matchingTasksResult.rows;

    // Получаем все задачи, соответствующие уровню пользователя
    const allTasksMatchingLvlQuery = `
      SELECT * FROM tasks WHERE lvl = $1
    `;

    const allTasksMatchingLvlResult = await pool.query(
      allTasksMatchingLvlQuery,
      [userData.lvl]
    );
    const allTasksMatchingUserLvl = allTasksMatchingLvlResult.rows;

    // Сравниваем количество выполненных задач
    if (allTasksMatchingUserLvl.length === userTasksMatchingLvl.length) {
      const newLvl = parseInt(userData.lvl) + 1;

      const updateLvlQuery = `
        UPDATE users
        SET lvl = $1
        WHERE id = $2
        RETURNING lvl
      `;

      const updatedUserResult = await pool.query(updateLvlQuery, [newLvl, id]);
      return updatedUserResult.rows[0].lvl;
    } else {
      return false;
    }
  }
}

module.exports = UserService;
