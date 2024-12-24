const express = require("express");
const router = express.Router();
const TaskService = require("../psqlServices/task");

// router.get("/", async (req, res) => {
//   let allTasks = await TaskService.getAllTasks();
//   res.status(200).send(allTasks);
// });

router.get("/", async (req, res) => {
  try {
    const userTasks = await TaskService.syncTasksWithUser(req.tgId);
    res.status(200).json(userTasks.tasks);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const completedTask = await TaskService.markTaskInProgress(
      taskId,
      req.tgId
    );
    return res.status(200).send(completedTask);
  } catch (err) {
    return res.status(404).send(err.message);
  }
});

router.post("/start/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.tgId;

  try {
    const aprovedTask = await TaskService.startTask(userId, taskId);
    return res.send(aprovedTask);
  } catch (e) {
    return res.send(e.message);
  }
});

module.exports = router;
