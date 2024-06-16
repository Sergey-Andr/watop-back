const { model, Schema } = require("mongoose");

const Order = new Schema({
  id: [
    {
      id: { type: Number },
      quantity: { type: String },
    },
  ],
  deliveryAddress: {
    city: { type: String },
    street: { type: String },
    house: { type: String },
    floor: { type: String },
    time: { type: String },
  },
  payment: { type: String },
  orderId: { type: Number },
  date: { type: String },
  recipientFullName: { type: String },
  recipientPhone: { type: String },
  recipientEmail: { type: String },
});

module.exports = model("Order", Order);
