const mongoose = require("mongoose");
const { DISCOUNT_TYPES, DAY_MAP } = require("../config/constants");
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
        enum: DISCOUNT_TYPES,
        required: true,
      },
      amount: { type: Number, required: true },
    },
    maxRedeemCountPerUser: Number,
    maxCappedDiscount: Number,
    validDays: [
      {
        type: String,
        enum: DAY_MAP,
      },
    ],
    validCategories: [String],
    maxRedeemCount: Number,
    minApplicableAmount: Number,
    applyTo: {
      type: String,
      enum: APPLY_TO_TYPES,
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
