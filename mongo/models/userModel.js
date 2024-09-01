const mongoose = require("mongoose");
const cryptoId = require("../../utilities/cryptoId");
const { ObjectId } = require("mongodb");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  telegramId: { type: String, required: true, unique: true },
  money: { type: Number, default: 1000 },
  readyToClaim: { type: Boolean, default: true },
  lastClaim: { type: Date },
  moneyForClaim: { type: Number },
  hash: { type: String },
  tasks: [
    {
      _id: false,
      task: { type: String, ref: "Task" },
      isCompleted: { type: Boolean, default: false },
    },
  ],
});

userSchema.pre("save", function addHash() {
  const hash = cryptoId.encrypt(this.telegramId, process.env.SECRET_KEY_ID);
  this.hash = hash;
});

module.exports = mongoose.model("User", userSchema);
