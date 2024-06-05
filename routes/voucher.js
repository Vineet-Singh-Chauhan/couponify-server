const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");

router.post("/create", voucherController.createVoucher);

module.exports = router;
