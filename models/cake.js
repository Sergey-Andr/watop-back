const { mongoose, model } = require("mongoose");

const Cake = new mongoose.Schema({
  name: { type: String, required: true },
  taste: { type: String, required: true },
  price: { type: Number, required: true },
  popularity: { type: Number, required: true },
  related: { type: [Number], required: true },
  description: { type: String, required: true },
  type: { type: [String], required: true },
  image: { type: String, required: true },
  id: { type: Number, required: true },
});

module.exports = model("Cake", Cake);
