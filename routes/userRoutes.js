const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

// Todas estas rutas requieren Token + Rol Admin
router.get("/", [isAuth, isAdmin], userController.getAllUsers);
router.patch("/:id/role", [isAuth, isAdmin], userController.updateUserRole);
router.delete("/:id", [isAuth, isAdmin], userController.deleteUser);

module.exports = router;
