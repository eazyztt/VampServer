const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const buildings1 = require("./routes/buildings");
const userRoute = require("./routes/user");
const tasks = require("./routes/userTasks");
const friends = require("./routes/friends");
const db = require("./db");
require("dotenv").config();

const port = process.env.PORT;

// Используем body-parser для парсинга JSON запросов
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.use("/", buildings1);

app.use("/user", userRoute);

app.use("/tasks", tasks);

app.use("/friends", friends);
// Маршрут для обработки данных, отправленных с фронтенда

app.get("/", async (req, res) => {
  let userDocRef = db.collection("users").doc(process.env.ID);
  let userDoc = await userDocRef.get();
  if (userDoc.exists) {
    const { lvl, username, money } = userDoc.data();
    res.send({ lvl, username, money });
  } else {
    res.status(400).send("error");
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
