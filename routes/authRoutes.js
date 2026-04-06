const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const authController = require("../controllers/authController");

// 'foto' debe ser el nombre del campo en tu formulario (FormData)
router.post("/register", upload.single("foto"), authController.register);
// ...
router.post("/login", authController.login);
// ...

module.exports = router;
