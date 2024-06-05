const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");
const onlyAdminAccess = require("../middlewares/verifyAdmin");

router.get("/getAll", voucherController.handleGetAll);
router.get("/:expression", voucherController.handleGetDetails);
router.use(onlyAdminAccess);
router.post("/create", voucherController.handleCreate);
router.delete("/:expression", voucherController.handleDelete);
router.patch("/update", voucherController.handleUpdate);

module.exports = router;
