const db = require("../db");

const getAllTasks = async () => {
  const allTasksSnapshot = await db.collection("tasks").get();
  const tasks = [];

  allTasksSnapshot.forEach((doc) => {
    tasks.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return tasks;
};

const getTaskById = async (taskId) => {
  const taskDoc = db.collection("tasks").doc(taskId);
  const taskRef = await taskDoc.get();
  if (!taskRef.exists) {
    return false;
  }
  const task = taskRef.data();
  return task;
};

const getUserTasks = async (userId) => {
  const userRef = db.collection("users").doc(userId).collection("tasks");
  const userTasksDoc = await userRef.get();
  let userTasks = [];

  if (!userTasksDoc.exists) {
    userTasks = [];
  }

  userTasksDoc.forEach((doc) => {
    userTasks.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return userTasks;
};

const completeTask = async (userId, taskId) => {
  // Получение задачи по ID
  const task = await getTaskById(taskId);
  if (!task) {
    return false;
  }

  // Ссылка на документ задачи пользователя
  const userRef = db
    .collection("users")
    .doc(userId)
    .collection("tasks")
    .doc(taskId);

  // Получение задач пользователя
  const userTasks = await getUserTasks(userId);

  // Проверка, если задача уже существует в списке задач пользователя
  const taskExists = userTasks.some((userTask) => userTask.id === taskId);

  if (taskExists) {
    return false;
  } else {
    // Обновление задачи, помечая её как завершенную
    await userRef.set({
      ...task,
      isCompleted: true,
    });
    return task;
  }
};

module.exports = {
  getAllTasks,
  getUserTasks,
  completeTask,
};
