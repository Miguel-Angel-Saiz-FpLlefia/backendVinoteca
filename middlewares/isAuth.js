const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Leer el token del header (usualmente: Authorization: Bearer <token>)
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No hay token, permiso no válido" });
  }

  try {
    const cifrado = jwt.verify(token, process.env.JWT_SECRET);
    req.user = cifrado.user; // Metemos los datos del usuario en la petición
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token no válido" });
  }
};
