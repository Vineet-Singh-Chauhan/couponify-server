const mongoose = require("mongoose");
const { Schema } = mongoose;

const VoucherSchema = new Schema(
  {
    expression: { type: String, required: true, unique: true },
    startsOn: { type: Date, required: true },
    endsOn: { type: Date },
    owner: { type: String, required: true },
    value: {
      type: {
        type: String,
        enum: ["fixedAmount", "fixedPercent", "uptoAmount", "uptoPercent", "shipping"],
        required: true,
      },
      amount: { type: Number, required: true },
    },
    maxRedeemCountPerUser: Number,
    maxCappedDiscount: Number,
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
    validCategories: [String],
    maxRedeemCount: Number,
    minApplicableAmount: Number,
    applyTo: {
      type: String,
      enum: ["wholeCart", "items"],
      default: "wholeCart",
    },
    redeemedCount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

VoucherSchema.virtual("availableCount").get(function () {
  if (!this.maxRedeemCount) return "No limit";
  return this.maxRedeemCount - this.redeemedCount;
});

module.exports = mongoose.model("Voucher", VoucherSchema);
