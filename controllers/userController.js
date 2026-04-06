const User = require("../models/User");

// Obtener todos los usuarios (Solo Admin)
const getAllUsers = async (req, res) => {
  try {
    // .select('-password') excluye el campo password del resultado
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener la lista de usuarios" });
  }
};

// Cambiar el rol de un usuario (Ej: de 'user' a 'admin')
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // Se espera 'user', 'editor' o 'admin'

    if (!role || !["user", "editor", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Rol inválido" });
    }

    const userActualizado = await User.findByIdAndUpdate(
      id,
      { role },
      { returnDocument: "after" },
    ).select("-password");

    if (!userActualizado) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json(userActualizado);
  } catch (error) {
    res.status(400).json({ msg: "Error al actualizar el rol" });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
