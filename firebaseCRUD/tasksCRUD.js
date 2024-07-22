const db = require("../db");

function difference(setA, setB) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

//Вернет все задания, которые юзер еще не выполнил
let getTasks = async (userId) => {
  const userTasks = await getUserTasks(userId);
  const allTasksSnapshot = await db.collection("tasks").get();
  const tasks = [];

  allTasksSnapshot.forEach((doc) => {
    tasks.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return tasks.filter(
    (obj) => !userTasks.some((newObj) => newObj.id === obj.id)
  );
};

let completeTask = async (userId, taskId) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();
  const allTasksRef = db.collection("tasks");
  const queryRef = allTasksRef.where("id", "==", taskId);
  const taskData = await queryRef.get();
  let taskObj = {};
  taskData.forEach((doc) => {
    taskObj = {
      id: doc.id,
      ...doc.data(),
    };
  });
  const completedTasks = userData.completedTasks || [];
  completedTasks.push(taskObj);
  let money = userData.money + taskObj.reward;

  userRef.update({
    completedTasks,
    money,
  });

  return completedTasks;
};

let getUserTasks = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();
  const userTasks = userData.completedTasks;
  if (userTasks) {
    return userTasks;
  } else {
    return [];
  }
};

module.exports = {
  getTasks,
  getUserTasks,
  completeTask,
};
