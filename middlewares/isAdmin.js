module.exports = (req, res, next) => {
  // Verificamos si el usuario tiene el rol de admin
  if (req.user && req.user.role === "admin") {
    next(); // Si es admin, adelante
  } else {
    res
      .status(403)
      .json({ msg: "Acceso denegado: se requieren permisos de administrador" });
  }
};
