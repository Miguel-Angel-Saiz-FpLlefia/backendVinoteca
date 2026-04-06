const mongoose = require("mongoose");

const cervezaSchema = new mongoose.Schema(
  {
    nom: {
      type: String, // De que tipo es
      required: [true, "El nom és obligatori"], // [true/false, missatge d'error], si es requerido
      trim: true, // elimina espais en blanc al principi i al final
    },
    graduacio: {
      type: Number, // De que tipo es
      required: true, // si es requerido (true/false)
      min: [0, "La graduació ha de ser positiva"], // El valor minimo de un tipo numero
      max: 20, // El valor maximo de un tipo numero
    },
    tipus: {
      type: String,
      trim: true, // si es requerido (true/false)
      default: "Lager", // si no s'envia, es guarda 'Lager', valor por defecto
    },
    descripcio: {
      type: String, // De que tipo es
      trim: true, // Elimina los espacios en blanco
    },
    winery: {
      type: String,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: 0,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    imagen: {
      type: String,
      trim: true,
    },
    tastingNotes: {
      nose: [String],
      palate: [String],
      finish: String,
    },
    pairings: [String],
  },
  {
    timestamps: true, // afegeix automàticament createdAt i updatedAt
  },
);

module.exports = mongoose.model("Cerveza", cervezaSchema);
// Primero le ponemos el nombre de la colección de mongoDb Atlas y luego le enviamos el esquema.
