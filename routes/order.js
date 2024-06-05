const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderControlller");

router.post("/create", orderController.handleCreate);

module.exports = router;
