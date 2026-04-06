const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // La URI debe estar en tu archivo .env
    const conn = await mongoose.connect(process.env.MONGO_URI); //Conectarnos a la base de datos del mongoDb (recogida en mongoDB Atlas)

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`); // Muestra el porque no nos hemos podido conectar
    process.exit(1); // Detiene la app si no hay base de datos
  }
};

module.exports = connectDB;
