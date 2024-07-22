const express = require("express");
const router = express.Router();
const tasksCRUD = require("../firebaseCRUD/tasksCRUD");

router.get("/", async (req, res) => {
  let notCompletedTasks = await tasksCRUD.getTasks(process.env.ID);
  res.send(notCompletedTasks);
});

router.get("/userTasks", async (req, res) => {
  let completedTasks = await tasksCRUD.getUserTasks(process.env.ID);
  res.send(completedTasks);
});

router.post("/:taskId", async (req, res) => {
  let taskId = req.params.taskId;
  let completedTasks = await tasksCRUD.completeTask(process.env.ID, taskId);
  res.send(completedTasks);
});

module.exports = router;
