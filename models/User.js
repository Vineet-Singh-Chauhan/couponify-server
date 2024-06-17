const mongoose = require("mongoose");
const { USER_TYPES } = require("../config/constants");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      enum: USER_TYPES,
      default: "user",
    },
    addresses: [
      {
        addressLine: String,
        city: String,
        state: String,
      },
    ],
    cart: {
      items: [
        {
          itemId: Number,
          category: String,
          quantity: Number,
          price: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.virtual("cart.value").get(function () {
  return this.cart.items.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );
});

module.exports = mongoose.model("User", UserSchema);
