const Cerveza = require("../models/modelCerveza");

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const toJsonArray = (value) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return undefined;
};

const toJsonObject = (value) => {
  if (!value) return undefined;
  if (typeof value === "object") return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
};

const buildCervezaPayload = (req, currentCerveza = {}) => ({
  nom: req.body.nom ?? req.body.name ?? currentCerveza.nom,
  graduacio:
    toNumber(req.body.graduacio) ??
    toNumber(req.body.alcohol) ??
    currentCerveza.graduacio,
  tipus: req.body.tipus ?? req.body.type ?? currentCerveza.tipus,
  descripcio:
    req.body.descripcio ?? req.body.description ?? currentCerveza.descripcio,
  winery: req.body.winery ?? currentCerveza.winery,
  region: req.body.region ?? currentCerveza.region,
  country: req.body.country ?? currentCerveza.country,
  type: req.body.type ?? currentCerveza.type,
  price: toNumber(req.body.price) ?? currentCerveza.price,
  stock: toNumber(req.body.stock) ?? currentCerveza.stock,
  rating: toNumber(req.body.rating) ?? currentCerveza.rating,
  imagen: req.file ? req.file.path : (req.body.imagen ?? currentCerveza.imagen),
  tastingNotes:
    toJsonObject(req.body.tastingNotes) ?? currentCerveza.tastingNotes,
  pairings: toJsonArray(req.body.pairings) ?? currentCerveza.pairings,
});

// Llistat: find() sense filtre retorna tots; sort({ createdAt: -1 }) = més nous primer
const getCervezas = async (req, res) => {
  try {
    const dades = await Cerveza.find().sort({ createdAt: -1 });
    res.json({ dades, total: dades.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Un per id: findById retorna null si no existeix; MongoDB usa _id (ObjectId)
const getCervezaById = async (req, res) => {
  try {
    const cerveza = await Cerveza.findById(req.params.id);
    if (!cerveza) {
      return res
        .status(404)
        .json({ error: "Cervesa no trobada", id: req.params.id });
    }
    res.json(cerveza);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear: create() valida amb l'esquema i guarda a la col·lecció
const createCerveza = async (req, res) => {
  try {
    const nova = await Cerveza.create(buildCervezaPayload(req));
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: err.message }); // 400 per errors de validació
  }
};

// Actualitzar: returnDocument: 'after' retorna el document ja actualitzat; runValidators aplica les regles de l'esquema
const updateCerveza = async (req, res) => {
  try {
    const cervezaActual = await Cerveza.findById(req.params.id);
    if (!cervezaActual) {
      return res
        .status(404)
        .json({ error: "Cervesa no trobada", id: req.params.id });
    }

    const actualitzada = await Cerveza.findByIdAndUpdate(
      req.params.id,
      buildCervezaPayload(req, cervezaActual),
      { returnDocument: "after", runValidators: true },
    );
    res.json(actualitzada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Esborrar: findByIdAndDelete retorna el document esborrat o null
const deleteCerveza = async (req, res) => {
  try {
    const eliminada = await Cerveza.findByIdAndDelete(req.params.id);
    if (!eliminada) {
      return res
        .status(404)
        .json({ error: "Cervesa no trobada", id: req.params.id });
    }
    res.status(204).send(); // 204 No Content: èxit sense cos
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCervezas,
  getCervezaById,
  createCerveza,
  updateCerveza,
  deleteCerveza,
};
