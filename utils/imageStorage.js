const toDataUrl = (file) => {
  if (!file || !file.buffer) return undefined;
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

const getStoredImageValue = (file, fallback) => {
  if (!file) return fallback;
  if (file.path) return file.path;
  return toDataUrl(file) ?? fallback;
};

module.exports = { getStoredImageValue };
