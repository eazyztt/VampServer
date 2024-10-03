const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const improvements = require("./routes/improvementRoute");
const userRoute = require("./routes/user");
const tasks = require("./routes/userTasks");
const friends = require("./routes/friends");
const authRouter = require("./routes/authRouteTest");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const TaskService = require("./mongo/services/taskService");
const UserService = require("./mongo/services/userService");
const ImproveService = require("./mongo/services/improveService");
const { Telegram } = require("telegraf");

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

async function connectToDB() {
  return mongoose.connect(process.env.MONGO_URL);
}

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

//TaskService.create({ title: "second", description: "second" });

// UserService.create({
//   name: "Steph",
//   telegramId: "143294783",
// });

//UserService.completeTask();

async function anon() {
  await UserService.create({
    name: "Stephoo",
    telegramId: "31290382931",
  });
}

// async function anon2(id) {
//   try {
//     await UserService.updateImprovement(id);
//   } catch (err) {
//     console.error(err.message);
//   }
// }

// anon2("66db384e021545383d94fb54", true);

//anon();
