const express = require("express");
const {
  getVinosAll,
  getVinosById,
  createVino,
  updateVino,
  deleteVino,
} = require("../controllers/controladoresVinos");
const upload = require("../middlewares/upload");
const isAuth = require("../middlewares/isAuth");
const isAdminOrEditor = require("../middlewares/isAdminOrEditor");

const routerVino = express.Router();

routerVino.get("/", getVinosAll);
routerVino.get("/:id", getVinosById);
routerVino.post(
  "/",
  [isAuth, isAdminOrEditor, upload.any()],
  createVino,
);
routerVino.put(
  "/:id",
  [isAuth, isAdminOrEditor, upload.any()],
  updateVino,
);
routerVino.delete("/:id", [isAuth, isAdminOrEditor], deleteVino);

module.exports = routerVino;
