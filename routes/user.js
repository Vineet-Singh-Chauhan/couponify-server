const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/create", userController.handleCreate);
router.post("/login", userController.handleLogin);
router.post("/logout", userController.handleLogout);

module.exports = router;
