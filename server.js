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
const verifyInitData = require("./auth/auth");
const { message } = require("telegraf/filters");

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

const verifyAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const { username, id } = verifyInitData(authHeader);
  if (!username || !id) {
    return res.status(401).json({ message: "No valid token" });
  }

  req.tgId = id;
  req.username = username;
  // Дальше выполняется логика валидации
  next();
};

// Используем body-parser для парсинга JSON запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(verifyAuth);

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
