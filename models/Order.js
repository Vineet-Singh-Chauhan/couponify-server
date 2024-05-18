const mongoose = require("mongoose");
const { Schema } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new Schema(
  {
    userId: { type: ObjectId, required: true },
    address: {
      addressLine: String,
      city: String,
      state: String,
      required: true,
    },
    items: [
      {
        itemId: Number,
        category: String,
        quantity: Number,
        price: Number,
      },
    ],
    value: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
