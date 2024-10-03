const mongoose = require("mongoose");

const TaskModel = mongoose.Schema({
  title: { type: String },
  description: { type: String },
  link: { type: String },
  lvl: { type: Number },
});

module.exports = mongoose.model("Task", TaskModel);
