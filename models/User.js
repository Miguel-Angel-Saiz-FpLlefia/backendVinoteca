const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    foto: { type: String }, // Guardaremos la ruta del archivo (ej: 'uploads/foto.jpg')
    role: {
      type: String,
      enum: ["user", "editor", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
); // Añade createdAt y updatedAt automáticamente

module.exports = mongoose.model("User", UserSchema);
