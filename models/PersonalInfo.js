const { model, Schema } = require("mongoose");

const PersonalInfo = new Schema({
  firstName: { type: String },
  secondName: { type: String },
  birthDate: { type: Date },
  gender: { type: String },
  phone: { type: String },
  recipientEmail: { type: String },
  telegram: { type: String },
  deliveryAddress: {
    city: { type: String },
    street: { type: String },
    house: { type: String },
    floor: { type: String },
  },
  card: {
    cardNumber: { type: String },
    expirationDate: { type: String },
    cvv: { type: String },
  },
});

module.exports = model("PersonalInfo", PersonalInfo);
