const Voucher = require("../models/Voucher");

exports.handleCreate = async (req, res) => {
  const {
    expression,
    startsOn,
    endsOn,
    amount,
    type,
    validDays,
    validCategories,
    maxRedeemCount,
    maxRedeemCountPerUser,
    applyTo,
    maxCappedDiscount,
    redeemedCount,
    minApplicableAmount,
  } = req.body;

  // TODO: validating request body

  const duplicate = await Voucher.findOne({ expression }).exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "This expression is already used!" });

  try {
    const result = await Voucher.create({
      expression,
      startsOn,
      endsOn,
      owner: req.email,
      amount,
      value: { type, amount },
      validDays,
      validCategories,
      maxRedeemCount,
      maxRedeemCountPerUser,
      applyTo,
      maxCappedDiscount,
      redeemedCount,
      minApplicableAmount,
    });
    res.status(201).json({
      message: "Voucher created successfully",
      voucherId: result._id,
      voucherName: result.expression,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.handleGetAll = async (req, res) => {
  const adminEmail = req.email;
  try {
    const vouchers = await Voucher.find({ owner: adminEmail });
    res.status(200).json({ vouchers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.handleGetDetails = async (req, res) => {
  const expression = req.params.expression;
  try {
    const voucher = await Voucher.findOne({ expression: expression });
    res.status(200).json({ voucher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.handleDelete = async (req, res) => {
  const expression = req.params.expression;
  try {
    await Voucher.findOneAndDelete({ expression });
    res.status(204).json({ message: "deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.handleUpdate = async (req, res) => {
  // TODO: validating request body

  const expression = req.body.expression;
  try {
    const result = await Voucher.findOneAndUpdate(
      {
        expression,
      },
      { ...req.body },
      {
        new: true,
      }
    ).exec();
    if (!result)
      return res.status(404).json({
        message: "Voucher not found ",
      });
    res.status(200).json({
      message: "Voucher updated successfully",
      voucher: result,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
