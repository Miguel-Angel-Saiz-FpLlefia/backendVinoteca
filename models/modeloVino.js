const mongoose = require("mongoose");

const vinoSchema = new mongoose.Schema(
  {
    nom: {
      type: String, // De que tipo es
      required: [true, "El nom és obligatori"], // [true/false, missatge d'error], si es requerido
      trim: true, // elimina espais en blanc al principi i al final
    },
    anioFermentacion: {
      type: Number, // De que tipo es
      required: true, // si es requerido (true/false)
      min: [0, "La graduació ha de ser positiva"], // El valor minimo de un tipo numero
      max: 2026, // El valor maximo de un tipo numero
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
    tipus: {
      type: String,
      enum: ["Tinto", "Blanco", "Rosé", "Espumoso"],
      default: "Tinto",
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    grape: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 0,
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
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.tipus = ret.tipus || ret.type || "Tinto";
        ret.type = ret.type || ret.tipus;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.tipus = ret.tipus || ret.type || "Tinto";
        ret.type = ret.type || ret.tipus;
        return ret;
      },
    },
  },
);

vinoSchema.pre("save", function () {
  if (!this.tipus && this.type) {
    this.tipus = this.type;
  }

  if (!this.type && this.tipus) {
    this.type = this.tipus;
  }
});

module.exports = mongoose.model("Vino", vinoSchema);
