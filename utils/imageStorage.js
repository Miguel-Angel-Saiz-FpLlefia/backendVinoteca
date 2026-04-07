const toDataUrl = (file) => {
  if (!file || !file.buffer) return undefined;
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
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

  if (!file) return fallback;
  if (file.path) return file.path;
  return toDataUrl(file) ?? fallback;
};

module.exports = { getStoredImageValue, getUploadedFile };
