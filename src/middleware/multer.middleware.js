import multer from "multer";

const createUploadMiddleware = (config) => {
  const {
    allowedTypes,
    maxFileSize = 5 * 1024 * 1024,
    maxFiles = 5,
    errorMessage = `File type not allowed. Only ${allowedTypes
      .map((type) => type.split("/")[1].toUpperCase())
      .join(", ")} files are accepted.`,
  } = config;

  const fileFilter = (_req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(errorMessage), false);
    }
  };

  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxFileSize,
      files: maxFiles,
    },
    fileFilter,
  });
};

export default createUploadMiddleware;
