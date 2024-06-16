const { Schema, model } = require("mongoose");

const Counter = new Schema({
  value: { type: Number, default: 0 },
});

module.exports = model("Counter", Counter);
