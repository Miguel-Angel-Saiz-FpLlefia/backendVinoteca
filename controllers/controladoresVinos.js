const Vino = require("../models/modeloVino");

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

const buildVinoPayload = (req, currentVino = {}) => ({
  nom: req.body.nom ?? req.body.name ?? currentVino.nom,
  anioFermentacion:
    toNumber(req.body.anioFermentacion) ??
    toNumber(req.body.year) ??
    currentVino.anioFermentacion,
  descripcio:
    req.body.descripcio ?? req.body.description ?? currentVino.descripcio,
  winery: req.body.winery ?? currentVino.winery,
  region: req.body.region ?? currentVino.region,
  country: req.body.country ?? currentVino.country,
  tipus: req.body.tipus ?? req.body.type ?? currentVino.tipus ?? "Tinto",
  type: req.body.type ?? req.body.tipus ?? currentVino.type ?? "Tinto",
  grape: req.body.grape ?? currentVino.grape,
  year: toNumber(req.body.year) ?? currentVino.year,
  price: toNumber(req.body.price) ?? currentVino.price,
  stock: toNumber(req.body.stock) ?? currentVino.stock,
  rating: toNumber(req.body.rating) ?? currentVino.rating,
  imagen: req.file ? req.file.path : (req.body.imagen ?? currentVino.imagen),
  tastingNotes: toJsonObject(req.body.tastingNotes) ?? currentVino.tastingNotes,
  pairings: toJsonArray(req.body.pairings) ?? currentVino.pairings,
});

const getVinosAll = async (req, res) => {
  try {
    const datos = await Vino.find().sort({ createdAt: -1 });
    res.json({ datos, total: datos.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getVinosById = async (req, res) => {
  try {
    const vino = await Vino.findById(req.params.id);
    if (!vino) {
      return res
        .status(404)
        .json({ error: "Vino no encontrado", id: req.params.id });
    }
    res.json(vino);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createVino = async (req, res) => {
  try {
    const payload = buildVinoPayload(req);
    const nova = await Vino.create(payload);
    const response = nova.toObject();
    response.tipus = payload.tipus;
    response.type = payload.type;
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateVino = async (req, res) => {
  try {
    const vinoActual = await Vino.findById(req.params.id);
    if (!vinoActual) {
      return res
        .status(404)
        .json({ error: "Vino no encontrado", id: req.params.id });
    }

    const actualizada = await Vino.findByIdAndUpdate(
      req.params.id,
      buildVinoPayload(req, vinoActual),
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    const response = actualizada ? actualizada.toObject() : null;
    if (response) {
      response.tipus =
        response.tipus ?? req.body.tipus ?? req.body.type ?? vinoActual.tipus;
      response.type =
        response.type ?? req.body.type ?? req.body.tipus ?? vinoActual.type;
    }
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteVino = async (req, res) => {
  try {
    const eliminada = await Vino.findByIdAndDelete(req.params.id);
    if (!eliminada) {
      return res
        .status(404)
        .json({ error: "Vino no encontrado", id: req.params.id });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getVinosAll,
  getVinosById,
  createVino,
  updateVino,
  deleteVino,
};
