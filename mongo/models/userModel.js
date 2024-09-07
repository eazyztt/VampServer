const mongoose = require("mongoose");
const cryptoId = require("../../utilities/cryptoId");
const { ObjectId } = require("mongodb");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  telegramId: { type: String, required: true, unique: true },
  money: { type: Number, default: 1000 },
  readyToClaim: { type: Boolean, default: true },
  lastClaim: {
    type: Date,
    default: new Date("September 02, 2005 16:30:00"),
  },
  moneyForClaim: { type: Number, default: 0 },
  hash: { type: String },
  improves: [
    {
      _id: false,
      improveId: { type: ObjectId, ref: "Improve" },
      lvl: { type: Number },
      price: { type: Number },
      income: { type: Number },
    },
  ],
  tasks: [
    {
      _id: false,
      id: { type: String, ref: "Task" },
      isCompleted: { type: Boolean, default: false },
    },
  ],
  friends: [
    {
      name: { type: String },
      id: { type: ObjectId, ref: "User" },
      invitedByMe: { type: Boolean },
    },
  ],
});

userSchema.pre("save", function addHash() {
  const hash = cryptoId.encrypt(this.telegramId, process.env.SECRET_KEY_ID);
  this.hash = hash;
});

module.exports = mongoose.model("User", userSchema);
