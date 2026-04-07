const multer = require("multer");
const path = require("path");

// Definición dónde y cómo se guardan los archivos
const storage = process.env.VERCEL
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/"); // Es un middelware
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
      },
    });

// Filtro para aceptar unicamente las imagenes

const filterImage = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de archivo no permitido. Solo imágenes (jpg, png, webp) .",
      ),
      false,
    );
  }
};

// Exportar la configuración

const upload = multer({
  storage: storage, // Donde se va a guardar
  limits: {
    fileSize: 1024 * 1024 * 4, // 4 Mb
  }, // El limite de tamaño del archivo
  fileFilter: filterImage, // Que tipo de archivo accepta
});

module.exports = upload;
