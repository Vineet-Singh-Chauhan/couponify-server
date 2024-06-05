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
    },
    items: [
      {
        itemId: Number,
        category: String,
        quantity: Number,
        price: Number,
      },
    ],
    voucherUsed: String,
    shippingCharge: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
orderSchema.virtual("value").get(function () {
  return this.items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
});
orderSchema.virtual("payable").get(function () {
  return this.value - this.discountAmount + this.shippingCharge;
});
module.exports = mongoose.model("Order", orderSchema);
