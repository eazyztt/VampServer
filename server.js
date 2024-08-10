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

app.get("/", async (req, res) => {
  let userDocRef = db.collection("users").doc(process.env.ID);
  let userDoc = await userDocRef.get();
  if (userDoc.exists) {
    const hash = cryptoId.encrypt(process.env.ID, process.env.SECRET_KEY_ID);
    await cryptoId.hashToDB(process.env.ID, hash);
    res.send(userDoc.data());
  } else {
    res.status(400).send("error");
  }
});

//получение хэша из БД
app.get("/userHashURL", async (req, res) => {
  const hash = await cryptoId.hashFromDB(process.env.ID);
  if (!hash) {
    return res.send("no user in DB?");
  }
  return res.send(hash);
});

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
