const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const improvements = require("./routes/improvementRoute");
const userRoute = require("./routes/user");
const tasks = require("./routes/userTasks");
const friends = require("./routes/friends");
const tgData = require("./routes/tgData");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT;

//app.set("trust proxy", 1);
app.use(
  cors({
    origin: "https://my-vamp-app.netlify.app",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // установить true, если используете HTTPS
    },
  })
);

// const corsOptions = {
//   origin: function (origin, callback) {
//     const allowedOrigins = ["https://my-vamp-app.netlify.app"];

//     // Разрешаем запросы без Origin (например, от Postman)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true, // Разрешаем отправку credentials (cookies, авторизация)
// };

// Используем body-parser для парсинга JSON запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/telegram-data", tgData);

app.use("/improvements", improvements);

app.use("/", userRoute);

app.use("/tasks", tasks);

app.use("/friends", friends);

//app.use("/auth", authRouter);

async function connectToDB() {
  return mongoose.connect(process.env.MONGO_URL);
}

connectToDB()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
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

// async function anon2(id) {
//   try {
//     await UserService.updateImprovement(id);
//   } catch (err) {
//     console.error(err.message);
//   }
// }

// anon2("66db384e021545383d94fb54", true);

//anon();
