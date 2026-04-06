const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const dbReady = connectDB();

const corsOptions = {
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 1. Middlewares Globales
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json()); // Para leer JSON en el body
app.use("/uploads", express.static("uploads")); // Para servir fotos

// 2. Conexión a Base de Datos
app.use(async (_req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (error) {
    res.status(500).json({
      error: `Error de conexión a la base de datos: ${error.message}`,
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend funcionando" });
});

// 3. Rutas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vinos", require("./routes/routerVinos"));
app.use("/api/cervezas", require("./routes/routesCervezas"));
app.use("/api/pedidos", require("./routes/pedidoRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Servidor volando en el puerto ${PORT}`));
}

module.exports = app;
