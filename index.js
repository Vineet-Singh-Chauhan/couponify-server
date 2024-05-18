require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");
const connectDB = require("./config/db");

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = mongoose.connection;

app.use("/user", require("./routes/user"));

db.on("open", () => {
  console.log("Connected to database");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
