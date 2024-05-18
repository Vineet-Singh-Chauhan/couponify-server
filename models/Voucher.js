const mongoose = require("mongoose");
const { Schema } = mongoose;

const VoucherSchema = new Schema(
  {
    expression: { type: String, required: true },
    startsOn: { type: Date, required: true },
    endsOn: { type: Date },
    value: {
      type: {
        type: String,
        enum: ["amount", "percent", "fixed", "shipping", "upto"],
        required: true,
      },
      amount: { type: Number, required: true },
      required: true,
    },
    validDays: [
      {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednessday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
    ],
    validCategories: [{ type: String }],
    maxRedeemCount: {
      type: Number,
      min: -1,
      default: -1,
      required: true,
    },
    maxRedeemCountPerUser: {
      type: Number,
      min: -1,
      default: -1,
      required: true,
    },
    applyTo: {
      type: Sring,
      enum: ["wholeCart", "items"],
      default: "wholeCart",
    },
    maxCappedDiscount: {
      type: {
        type: String,
        enum: ["amount", "percent", "fixed", "shipping", "upto"],
        required: true,
      },
      amount: { type: Number, required: true },
    },
    redeemedCount: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Voucher", VoucherSchema);
