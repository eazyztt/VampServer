const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const improvements = require("./routes/improvementRoute");
const userRoute = require("./routes/user");
const tasks = require("./routes/userTasks");
const friends = require("./routes/friends");
const authRouter = require("./routes/authRoute");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT;

app.use(cors());

app.use(
  session({
    secret: process.env.COOKIE_KEY, //секретный ключ
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Используем body-parser для парсинга JSON запросов
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.use("/", improvements);

app.use("/user", userRoute);

app.use("/tasks", tasks);

app.use("/friends", friends);

app.use("/auth", authRouter);

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
