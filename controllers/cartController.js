const User = require("../models/User");

exports.handleAddItems = async (req, res) => {
  const items = req.body.items;
  // validating request body
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "body is not in required format" });
  }
  const isBodyCorrect = items.every((e) => e.itemId && e.quantity && e.price);

  if (!isBodyCorrect)
    return res.status(400).json({ message: "body is not in required format" });

  const result = await User.findOneAndUpdate(
    { email: req.email },
    {
      cart: {
        items: items,
      },
    },
    {
      new: true,
    }
  ).exec();
  res.status(200).json({
    message: "items added to cart successfully",
    cart: result.cart,
    value: result.cart.value,
  });
};
