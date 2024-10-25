const express = require("express");
const router = express.Router();
const TaskService = require("../psqlServices/task");

router.get("/", async (req, res) => {
  let allTasks = await TaskService.getAllTasks();
  res.status(200).send(allTasks);
});

router.get("/userTasks", async (req, res) => {
  try {
    const userTasks = await TaskService.getUserTasks(req.tgId);
    res.status(200).json(userTasks);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const completedTask = await TaskService.completeTask(req.tgId, taskId);
    return res.status(200).send(completedTask);
  } catch (err) {
    return res.status(404).send(err.message);
  }
});

module.exports = router;
