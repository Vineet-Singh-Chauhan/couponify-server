const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/addItems", cartController.handleAddItems);

module.exports = router;
