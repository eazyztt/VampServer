const express = require("express");
const router = express.Router();
const tasksCRUD2 = require("../firebaseCRUD/tasksCRUD");

router.get("/", async (req, res) => {
  let allTasks = await tasksCRUD2.getAllTasks(process.env.ID);
  res.send(allTasks);
});

router.get("/userTasks", async (req, res) => {
  let userTasks = await tasksCRUD2.getUserTasks(process.env.ID);
  return res.send(userTasks);
});

router.post("/addTask/:taskId", async (req, res) => {
  let taskId = req.params.taskId;
  let completedTask = await tasksCRUD2.completeTask(process.env.ID, taskId);
  if (completedTask) {
    return res.send(completedTask);
  } else {
    return res.send("Task is already completed or no such task");
  }
});

router.post("/:taskId", async (req, res) => {
  let taskId = req.params.taskId;
  let completedTask = await tasksCRUD2.completeTask(process.env.ID, taskId);
  if (completedTask) {
    return res.send(completedTask);
  } else {
    return res.send("Task is already completed or no such task");
  }
});

module.exports = router;
