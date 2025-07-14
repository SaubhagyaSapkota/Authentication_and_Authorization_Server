import multer from "multer";
import path from "path";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Add your file filter logic here if needed
  cb(null, true);
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

export default upload;
