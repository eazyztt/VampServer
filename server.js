const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const verifyInitData = require("./auth/crypt");
const session = require("express-session");
const buildings = require("./routes/buildings");
const userRoute = require("./routes/user");
const db = require("./db");
require("dotenv").config();

const port = process.env.PORT;

// app.use(
//   session({
//     secret: process.env.COOKIE_KEY, //секретный ключ
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );

// Используем body-parser для парсинга JSON запросов
app.use(bodyParser.json());
app.set("view engine", "ejs");

function tgAuthCheck(req, res, next) {
  const telegramData = req.body;
  console.log(telegramData);
  req.body.userIdName = verifyInitData(telegramData.token);
  let id = req.body.userIdName.id;
  if (!id) {
    res.send("no auth");
  } else {
    next();
  }
}

//проверка пользователя при каждом запросе или переходе на другую страницу (работает на всех маршрутах приложения)
app.use("/", tgAuthCheck);

app.use("/", buildings);

app.use("/user", userRoute);

// Маршрут для обработки данных, отправленных с фронтенда

app.get("/", async (req, res) => {
  let id = req.body.userIdName.id;
  let userDocRef = db.collection("users").doc(id);
  let userDoc = await userDocRef.get();
  if (userDoc.exists) {
    const { lvl, username, money } = userDoc.data();
    res.render("pages/indexProfile", { lvl, username, money });
  } else {
    res.status(400).send("error");
  }
});

app.get("/telegram-data", async (req, res) => {
  res.render("pages/indexi");
});

app.post("/telegram-data", async (req, res) => {
  const telegramData = req.body;
  console.log(telegramData.initData);
  let { username, id } = verifyInitData(telegramData.initData);
  if (username && id) {
    const userRef = db.collection("users").doc(id);
    let userDoc = await userRef.get();
    if (!userDoc.exists) {
      const money = 10000;
      const lvl = 1;
      const moneyForClaim = 100;
      let lastClaim = Date.now();
      const hours = lastClaim.getHours();
      lastClaim.setHours(hours - 4);
      await userRef.set({
        username,
        id,
        money,
        lvl,
        moneyForClaim,
        lastClaim,
      });
      console.log("User data saved to Firestore");
    }
    req.session.tgUser = username;
    req.session.userId = id;
    res.redirect("/");
  } else {
    res.send("errorAuth");
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
