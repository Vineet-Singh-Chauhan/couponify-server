const Order = require("../models/Order");
const User = require("../models/User");
const Voucher = require("../models/Voucher");
const dayMap = [
  "sunday",
  "monday",
  "tuesday",
  "wednessday",
  "thursday",
  "friday",
  "saturday",
];

const isVoucherValid = async (voucher, userId, value) => {
  // check for date range
  const today = new Date();
  const voucherStartDate = new Date(voucher.startsOn);
  let voucherEndDate;
  if (voucher.endsOn) voucherEndDate = new Date(voucher.endsOn);
  if (
    today < voucherStartDate &&
    (voucher.endsOn ? today > voucherEndDate : true)
  )
    return { status: false, message: "voucher no longer valid" };
  // max redeem per user
  const prevOrdersCount = await Order.countDocuments({
    userId,
    "voucherUsed.expression": voucher.expression,
  });
  if (
    voucher.maxRedeemCountPerUser &&
    prevOrdersCount >= voucher.maxRedeemCountPerUser
  )
    return { status: false, message: "max voucher limit reached for the user" };

  // max redeem limit
  const redeemedCount = await Order.countDocuments({
    "voucherUsed.expression": voucher.expression,
  });

  if (voucher.maxRedeemCount && redeemedCount >= voucher.maxRedeemCount)
    return { status: false, message: "max voucher limit reached " };
  // valid days
  if (
    voucher.validDays.length != 0 &&
    !voucher.validDays.includes(dayMap[today.getDay()])
  )
    return { status: false, message: "voucher not applicable  for the day" };
  // min applicable amount
  if (voucher.minApplicableAmount && value < voucher.minApplicableAmount)
    return {
      status: false,
      message: `minimum spend must be ${voucher.minApplicableAmount}`,
    };

  return { status: true };
};

const getNetDiscount = (voucher, items, value) => {
  let total = 0;
  let discountAmount = 0;

  // valid category items only
  if (voucher.validCategories) {
    total = voucher.validCategories.reduce((amount, category) => {
      amount += items.reduce((acc, curr) => {
        if (curr.category == category)
          return (acc += curr.price * curr.quantity);
        else return acc;
      }, 0);
    }, 0);
  } else {
    total = value;
  }

  // value types
  const voucherType = voucher.value.type;
  const voucherAmount = voucher.value.amount;
  if (voucherType == "fixedAmount") discountAmount = voucherAmount;
  else if (voucherType == "fixedPercent")
    discountAmount = total * voucherAmount;
  else if (voucherType == "uptoAmount")
    discountAmount = Number.parseInt(Math.random()) * voucherAmount;
  else if (voucherType == "uptoPercent")
    discountAmount = Number.parseInt(Math.random()) * voucherAmount * total;

  // max cap amount
  if (discountAmount > voucher.maxCappedDiscount) {
    discountAmount = voucher.maxCappedDiscount;
  }

  return discountAmount;
};

exports.handleCreate = async (req, res) => {
  const userEmail = req.email;
  const { addressLine, city, state } = req.body.address;
  const { voucherUsed } = req.body;
  try {
    const voucher = await Voucher.findOne({ expression: voucherUsed });
    if (!voucher)
      return res.status(400).json({ message: "Invalid voucher used" });
    const user = await User.findOne({ email: userEmail });
    const isVoucherApplicable = await isVoucherValid(
      voucher,
      user._id,
      user.cart.value
    );
    if (!isVoucherApplicable.status)
      return res.status(406).json({ message: isVoucherApplicable.message });
    const discountAmount = getNetDiscount(
      voucher,
      user.cart.items,
      user.cart.value
    );

    await User.findOneAndUpdate(
      { email: userEmail },
      {
        cart: {
          $set: {
            items: [],
          },
        },
      }
    );

    let shippingCharge = 100; // coming from some other service

    if (voucher.value.type == "shipping") shippingCharge = 0;
    const result = await Order.create({
      userId: user._id,
      address: { addressLine, city, state },
      items: user.cart.items,
      voucherUsed,
      shippingCharge,
      discountAmount,
    });
    res.status(201).json({
      message: "order created successfully",
      orderId: result._id,
      payable: result.payable,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
