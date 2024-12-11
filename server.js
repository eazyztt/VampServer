const express = require("express");
const sequelize = require("./psqlDb");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const userRoute = require("./routes/user");
const tasks = require("./routes/userTasks");
const friends = require("./routes/friends");
const tgData = require("./routes/tgData");
const tamagochi = require("./routes/tamagochi");
require("dotenv").config();
const cors = require("cors");
const verifyInitData = require("./auth/auth");

const port = process.env.PORT;

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection to PostgreSQL has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://my-vamp-app.netlify.app",
    credentials: true,
  })
);

// app.use(
//   session({
//     secret: process.env.COOKIE_KEY,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: true, // установить true, если используете HTTPS
//       sameSite: "lax",
//     },
//   })
// );

const verifyAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(`${authHeader} this is auth header`);

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

const deadVamp = (req, res, next) => {
  if (req.USER) {
    const isDead = req.USER.isDead;
    if (isDead) {
      return res.send("Vamp is DEAD!");
    }
  }

  next();
};

// Используем body-parser для парсинга JSON запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(verifyAuth);

app.use("/telegram-data", tgData);

app.use("/", deadVamp, userRoute);

app.use("/tasks", deadVamp, tasks);

app.use("/friends", deadVamp, friends);

app.use("/", deadVamp, tamagochi);

//app.use("/auth", authRouter);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

connectDB().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
