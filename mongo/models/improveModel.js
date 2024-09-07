const mongoose = require("mongoose");

const ImproveModel = mongoose.Schema({
  desc: { type: String },
  name: { type: String },
  globallyAble: { type: Boolean, default: true },
  coefPrice: { type: Number },
  coefIncome: { type: Number },
  initIncome: { type: Number },
  initPrice: { type: Number },
});

module.exports = mongoose.model("Improve", ImproveModel);
