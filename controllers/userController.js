const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required !" });

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res.status(400).json({ message: "No user with this email!" });
  }

  const isAuthenticated = await bcryptjs.compare(password, foundUser.password);

  if (!isAuthenticated) {
    return res.status(400).json({ message: "Enter valid email and password!" });
  }

  const payload = {
    email: foundUser.email,
    userType: foundUser.userType,
  };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });

  res.json({ username: foundUser.username, accessToken });
};

exports.handleSignup = async (req, res) => {
  const { username, email, password, userType } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill all the mandatory fields!" });
  }

  const duplicate = await User.findOne({ email: email }).exec();

  if (duplicate)
    return res
      .status(409)
      .json({ message: "This email is already registered!" });

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);
  try {
    await User.create({
      username,
      email,
      password: hashedPassword,
      userType,
    });
    res.status(201).json({
      message: "User created",
      username: username,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.handleLogout = async (req, res) => {
  // logout logic here
  res.sendStatus(204);
};
