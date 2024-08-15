const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const buildings1 = require("./routes/buildings");
const userRoute = require("./routes/user");
const tasks = require("./routes/userTasks");
const friends = require("./routes/friends");
const friendsCRUD = require("./firebaseCRUD/friendsCRUD");
const db = require("./db");
const userCRUD = require("./firebaseCRUD/userCRUD");
const checkURLHash = require("./utilities/checkURLHash");
const cryptoId = require("./utilities/cryptoId");
const improvementRoute = require("./routes/improvements");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT;

app.use(cors());

// Используем body-parser для парсинга JSON запросов
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.use("/", buildings1);

app.use("/user", userRoute);

app.use("/tasks", tasks);

app.use("/friends", friends);

app.use("/improvements", improvementRoute);
// Маршрут для обработки данных, отправленных с фронтенда

app.get("/", async (req, res) => {
  let userDocRef = db.collection("users").doc(process.env.ID);
  let userDoc = await userDocRef.get();
  if (userDoc.exists) {
    res.send(userDoc.data());
  } else {
    res.status(400).send("error");
  }
});

//получение хэша из БД

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
