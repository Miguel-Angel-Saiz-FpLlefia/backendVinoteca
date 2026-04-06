const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");
const isAuth = require("../middlewares/isAuth");

// Solo usuarios registrados pueden comprar
router.post("/", isAuth, pedidoController.crearPedido);

// Opcional: El usuario ve sus propios pedidos
router.get("/mis-pedidos", isAuth, pedidoController.getMisPedidos);

module.exports = router;
