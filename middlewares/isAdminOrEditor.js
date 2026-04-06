module.exports = (req, res, next) => {
  if (req.user && ["admin", "editor"].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      msg: "Acceso denegado: se requieren permisos de administrador o editor",
    });
  }
};
