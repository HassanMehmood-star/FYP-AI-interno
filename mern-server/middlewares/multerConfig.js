const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Extract the file extension
    cb(null, `${Date.now()}${fileExtension}`); // Use timestamp with the original extension
  },
});
