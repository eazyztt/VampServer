const express = require("express");
const session = require("express-session");
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
const authRouter = require("./routes/authRoute");
const userModel = require("./utilities/userModel");
const mainAuthFunc = require("./utilities/mainAuthFunc");
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

app.use("/", buildings1);

app.use("/user", userRoute);

app.use("/tasks", tasks);

app.use("/friends", friends);

app.use("/auth", authRouter);
// Маршрут для обработки данных, отправленных с фронтенда

//получение хэша из БД

// app.post("/", async (req, res) => {
//   const telegramData = req.body;
//   const userId = await mainAuthFunc(telegramData.initData);
//   if (userId) {
//     req.session.userId = userId;
//     return res.redirect("/");
//   } else {
//     res.send("errorAuth");
//   }
// });

//хэш добавляется к URL адресу, по примеру localhost:3000/473&327183HdgjdD
// app.post("/:hash", async (req, res) => {
//   const hash = req.params.hash;
//   const decrypt = cryptoId.decrypt(hash, process.env.SECRET_KEY_ID);
//   const user = await userCRUD.getUserDB(decrypt);

//   if (!user) {
//     return res.send("No such user in db");
//   }

//   let userFriends = user.friends;
//   let newUserFriends = [];
//   newUserFriends.push(user.id);

//   const existingUser = await userCRUD.setUserDoc("470676178", {
//     id: "470676178",
//     friends: newUserFriends,
//     lvl: 1,
//     money: 1000,
//     hash: cryptoId.encrypt("470676178", process.env.SECRET_KEY_ID),
//   });

//   if (!existingUser) {
//     return res.send("user is already in a game");
//   }

//   const newUser = await userCRUD.getUserDB("470676178");

//   const checkIfUserAlreadyFriend = await userCRUD.checkIfUserAlreadyInDB(
//     user.id,
//     newUser.id
//   );

//   if (!checkIfUserAlreadyFriend) {
//     return res.send("user is already in your friend list");
//   }

//   userFriends.push(newUser.id);

//   let friendsInvited = (user.friendsInvited += 1);

//   await userCRUD.updateUserDoc(decrypt, {
//     friendsInvited: friendsInvited,
//     friends: userFriends,
//   });

//   return res.send(newUser);
// });

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
