const toDataUrl = (file) => {
  if (!file || !file.buffer) return undefined;
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

const isLikelyImageReference = (value) => {
  if (typeof value !== "string" || !value.trim()) return false;

  return (
    value.startsWith("data:image/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/uploads/") ||
    value.startsWith("uploads/") ||
    /\.(jpe?g|png|webp|gif)$/i.test(value)
  );
};

const normalizeImageReference = (value) => {
  if (!isLikelyImageReference(value)) return undefined;

  if (value.startsWith("uploads/")) {
    return `/${value}`;
  }

  return value;
};

const getBodyImageReference = (body) => {
  if (!body || typeof body !== "object") return undefined;

  return normalizeImageReference(
    body.foto ?? body.imagen ?? body.image ?? body.avatar,
  );
};

const getUploadedFile = (req) => {
  if (req.file) return req.file;
  if (Array.isArray(req.files) && req.files.length > 0) {
    return req.files[0];
  }

  return undefined;
};

const getStoredImageValue = (fileOrReq, fallback) => {
  const looksLikeFile =
    fileOrReq &&
    (typeof fileOrReq.mimetype === "string" ||
      typeof fileOrReq.path === "string" ||
      Buffer.isBuffer(fileOrReq.buffer));

  const file = looksLikeFile ? fileOrReq : getUploadedFile(fileOrReq);

  const normalizedFallback = normalizeImageReference(fallback);

  if (!file && fileOrReq && fileOrReq.body) {
    const bodyImage = getBodyImageReference(fileOrReq.body);
    if (bodyImage) return bodyImage;
  }

  if (!file) return normalizedFallback;
  if (file.path) return normalizeImageReference(file.path);
  return toDataUrl(file) ?? normalizedFallback;
};

module.exports = { getStoredImageValue, getUploadedFile };
