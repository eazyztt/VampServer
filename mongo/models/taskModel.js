const mongoose = require("mongoose");

const TaskModel = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String },
  lvl: { type: String },
});

module.exports = mongoose.model("Task", TaskModel);
