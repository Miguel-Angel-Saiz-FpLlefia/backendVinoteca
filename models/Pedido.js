const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema(
  {
    // Relación con el usuario que hace la compra
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Array de productos comprados
    productos: [
      {
        productoId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "productos.productoModelo",
        },
        productoModelo: {
          type: String,
          required: true,
          enum: ["Vino", "Cerveza"],
        },
        cantidad: { type: Number, default: 1, min: 1 },
        precioUnidad: { type: Number, required: true, min: 0 }, // Guardamos el precio del momento de la compra
      },
    ],
    total: { type: Number, required: true },
    estado: {
      type: String,
      enum: ["pendiente", "pagado", "enviado", "cancelado"],
      default: "pendiente",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Pedido", PedidoSchema);
