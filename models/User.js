const { model, Schema } = require("mongoose");

const User = new Schema({
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  personalInfo: { type: Schema.Types.ObjectId, ref: "PersonalInfo" },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  roles: [{ type: String, ref: "Role" }],
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  changePassword: { type: String },
});

module.exports = model("User", User);
