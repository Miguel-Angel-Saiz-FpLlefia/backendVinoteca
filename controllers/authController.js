const User = require("../models/User"); // Ajusta a tu ruta de modelo
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getStoredImageValue } = require("../utils/imageStorage");

const DEFAULT_AVATAR_URL = "uploads/default-avatar.jpg";

const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body; // Del body recogemos el nombre, email y password

    // 1. Verificar si el usuario ya existe
    const existeUsuario = await User.findOne({ email }); // Verificamos si ya existe un usuario con ese email
    if (existeUsuario) {
      return res.status(400).json({ msg: "El usuario ya existe" }); // Si existe damos un error diciendo que el usuario ya existe
    }

    const salt = await bcrypt.genSalt(10); // Creamos un hash con bcrypt
    const hashedPassword = await bcrypt.hash(password, salt); // Hasheamos la contraseña con el hash creado + la contraseña recibida

    // 3. Crear el nuevo usuario
    // Si hay archivo en req.file, guardamos su ruta, si no, null o una por defecto
    const fotoPath = getStoredImageValue(req.file, DEFAULT_AVATAR_URL); // En local guarda ruta; en Vercel guarda data URL

    const nuevoUsuario = new User({
      nombre,
      email,
      password: hashedPassword,
      foto: fotoPath,
      role: "user", // Por defecto siempre es user
    }); // Creamos un usuario nuevo del esquema del user

    await nuevoUsuario.save(); // Guardamos el nuevo usur

    res.status(201).json({
      msg: "Usuario registrado con éxito",
      userId: nuevoUsuario._id,
    }); // Si se ha guardado devuelvp un 201 de usuario creado
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al registrar al usuario" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. ¿Existe el usuario?
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    // 2. ¿La contraseña coincide?
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    // 3. Crear el JWT
    // El payload guarda info útil pero NO sensible (no pongas la password aquí)
    const payload = {
      user: {
        id: usuario._id,
        role: usuario.role,
      },
    };

    // Firma el token con una clave secreta (guárdala en tu .env)
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" }, // El token expira en un día
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            nombre: usuario.nombre,
            role: usuario.role,
            foto: usuario.foto,
          },
        });
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

module.exports = { register, login };
