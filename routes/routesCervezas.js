const express = require("express");
const {
  getCervezas,
  getCervezaById,
  createCerveza,
  updateCerveza,
  deleteCerveza,
} = require("../controllers/cervezasController");
const upload = require("../middlewares/upload");
const isAuth = require("../middlewares/isAuth");
const isAdminOrEditor = require("../middlewares/isAdminOrEditor");

const routerCervezas = express.Router(); // Creamos un enrutador

routerCervezas.get("/", getCervezas);
routerCervezas.get("/:id", getCervezaById);
routerCervezas.post(
  "/",
  [isAuth, isAdminOrEditor, upload.single("imagen")],
  createCerveza,
);
routerCervezas.put(
  "/:id",
  [isAuth, isAdminOrEditor, upload.single("imagen")],
  updateCerveza,
);
routerCervezas.delete("/:id", [isAuth, isAdminOrEditor], deleteCerveza);

module.exports = routerCervezas;
