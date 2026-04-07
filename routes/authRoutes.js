const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const authController = require("../controllers/authController");

router.post("/register", upload.any(), authController.register);
// ...
router.post("/login", authController.login);
// ...

module.exports = router;
