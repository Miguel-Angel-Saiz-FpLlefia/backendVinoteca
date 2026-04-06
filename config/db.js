const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI no está definida");
  }

  if (!global.mongooseConnection) {
    global.mongooseConnection = {
      conn: null,
      promise: null,
    };
  }

  const cached = global.mongooseConnection;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((conn) => {
        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        console.error(`❌ Error de conexión: ${error.message}`);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    throw error;
  }
};

module.exports = connectDB;
